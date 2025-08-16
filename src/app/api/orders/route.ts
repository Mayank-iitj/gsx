import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single order by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const order = await db.select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json(order[0]);
    }

    // List orders with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(orders);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(orders.customerName, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(orders.status, status));
    }

    if (paymentMethod) {
      conditions.push(eq(orders.paymentMethod, paymentMethod));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = orders[sort as keyof typeof orders] || orders.createdAt;
    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || typeof body.customerName !== 'string') {
      return NextResponse.json({ 
        error: "Customer name is required and must be a string",
        code: "MISSING_CUSTOMER_NAME" 
      }, { status: 400 });
    }

    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json({ 
        error: "Amount is required and must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (!body.paymentMethod || typeof body.paymentMethod !== 'string') {
      return NextResponse.json({ 
        error: "Payment method is required and must be a string",
        code: "MISSING_PAYMENT_METHOD" 
      }, { status: 400 });
    }

    // Sanitize and prepare data
    const currentTimestamp = new Date().toISOString();
    const currentDate = new Date().toISOString().split('T')[0];

    const orderData = {
      customerName: body.customerName.trim(),
      amount: body.amount,
      paymentMethod: body.paymentMethod.trim(),
      status: body.status || 'pending',
      itemsCount: body.itemsCount || 1,
      date: body.date || currentDate,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    const newOrder = await db.insert(orders)
      .values(orderData)
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate fields if provided
    if (body.customerName !== undefined && (typeof body.customerName !== 'string' || !body.customerName.trim())) {
      return NextResponse.json({ 
        error: "Customer name must be a non-empty string",
        code: "INVALID_CUSTOMER_NAME" 
      }, { status: 400 });
    }

    if (body.amount !== undefined && (typeof body.amount !== 'number' || body.amount <= 0)) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (body.paymentMethod !== undefined && (typeof body.paymentMethod !== 'string' || !body.paymentMethod.trim())) {
      return NextResponse.json({ 
        error: "Payment method must be a non-empty string",
        code: "INVALID_PAYMENT_METHOD" 
      }, { status: 400 });
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.customerName !== undefined) {
      updates.customerName = body.customerName.trim();
    }

    if (body.amount !== undefined) {
      updates.amount = body.amount;
    }

    if (body.paymentMethod !== undefined) {
      updates.paymentMethod = body.paymentMethod.trim();
    }

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.itemsCount !== undefined) {
      updates.itemsCount = body.itemsCount;
    }

    if (body.date !== undefined) {
      updates.date = body.date;
    }

    const updated = await db.update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const deleted = await db.delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Order deleted successfully',
      deletedOrder: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}