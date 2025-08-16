import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, and, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single product by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const product = await db.select()
        .from(products)
        .where(eq(products.id, parseInt(id)))
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json({ 
          error: 'Product not found' 
        }, { status: 404 });
      }

      return NextResponse.json(product[0]);
    }

    // List products with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(products);

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }
    
    if (category) {
      conditions.push(eq(products.category, category));
    }
    
    if (status) {
      conditions.push(eq(products.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Add sorting
    const orderBy = order === 'asc' ? asc : desc;
    if (sort === 'name') {
      query = query.orderBy(orderBy(products.name));
    } else if (sort === 'price') {
      query = query.orderBy(orderBy(products.price));
    } else if (sort === 'category') {
      query = query.orderBy(orderBy(products.category));
    } else if (sort === 'rating') {
      query = query.orderBy(orderBy(products.rating));
    } else {
      query = query.orderBy(orderBy(products.createdAt));
    }

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
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!body.category || typeof body.category !== 'string' || !body.category.trim()) {
      return NextResponse.json({ 
        error: "Category is required and must be a non-empty string",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (!body.price || typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json({ 
        error: "Price is required and must be a positive number",
        code: "MISSING_PRICE" 
      }, { status: 400 });
    }

    // Sanitize and prepare data
    const productData = {
      name: body.name.trim(),
      category: body.category.trim(),
      price: body.price,
      stock: body.stock || 0,
      status: body.status || 'active',
      rating: body.rating || 0,
      image: body.image ? body.image.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newProduct = await db.insert(products)
      .values(productData)
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
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

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    const body = await request.json();

    // Validate fields if provided
    if (body.name !== undefined && (!body.name || typeof body.name !== 'string' || !body.name.trim())) {
      return NextResponse.json({ 
        error: "Name must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (body.category !== undefined && (!body.category || typeof body.category !== 'string' || !body.category.trim())) {
      return NextResponse.json({ 
        error: "Category must be a non-empty string",
        code: "INVALID_CATEGORY" 
      }, { status: 400 });
    }

    if (body.price !== undefined && (typeof body.price !== 'number' || body.price <= 0)) {
      return NextResponse.json({ 
        error: "Price must be a positive number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    if (body.stock !== undefined && (typeof body.stock !== 'number' || body.stock < 0)) {
      return NextResponse.json({ 
        error: "Stock must be a non-negative number",
        code: "INVALID_STOCK" 
      }, { status: 400 });
    }

    if (body.rating !== undefined && (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5)) {
      return NextResponse.json({ 
        error: "Rating must be a number between 0 and 5",
        code: "INVALID_RATING" 
      }, { status: 400 });
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.name) updates.name = body.name.trim();
    if (body.category) updates.category = body.category.trim();
    if (body.price !== undefined) updates.price = body.price;
    if (body.stock !== undefined) updates.stock = body.stock;
    if (body.status) updates.status = body.status;
    if (body.rating !== undefined) updates.rating = body.rating;
    if (body.image !== undefined) updates.image = body.image ? body.image.trim() : null;

    const updated = await db.update(products)
      .set(updates)
      .where(eq(products.id, parseInt(id)))
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

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}