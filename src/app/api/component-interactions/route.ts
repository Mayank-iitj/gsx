import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { componentInteractions } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(componentInteractions)
        .where(eq(componentInteractions.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Component interaction not found' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const componentType = searchParams.get('componentType');
    const interactionType = searchParams.get('interactionType');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(componentInteractions);

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(componentInteractions.componentType, `%${search}%`),
          like(componentInteractions.interactionType, `%${search}%`)
        )
      );
    }

    if (componentType) {
      conditions.push(eq(componentInteractions.componentType, componentType));
    }

    if (interactionType) {
      conditions.push(eq(componentInteractions.interactionType, interactionType));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderDirection = order === 'asc' ? asc : desc;
    if (sort === 'componentType') {
      query = query.orderBy(orderDirection(componentInteractions.componentType));
    } else if (sort === 'interactionType') {
      query = query.orderBy(orderDirection(componentInteractions.interactionType));
    } else if (sort === 'timestamp') {
      query = query.orderBy(orderDirection(componentInteractions.timestamp));
    } else {
      query = query.orderBy(orderDirection(componentInteractions.createdAt));
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
    if (!body.componentType) {
      return NextResponse.json({ 
        error: "componentType is required",
        code: "MISSING_COMPONENT_TYPE" 
      }, { status: 400 });
    }

    if (!body.interactionType) {
      return NextResponse.json({ 
        error: "interactionType is required",
        code: "MISSING_INTERACTION_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const componentType = body.componentType.toString().trim();
    const interactionType = body.interactionType.toString().trim();

    if (!componentType) {
      return NextResponse.json({ 
        error: "componentType cannot be empty",
        code: "EMPTY_COMPONENT_TYPE" 
      }, { status: 400 });
    }

    if (!interactionType) {
      return NextResponse.json({ 
        error: "interactionType cannot be empty",
        code: "EMPTY_INTERACTION_TYPE" 
      }, { status: 400 });
    }

    const currentTimestamp = new Date().toISOString();

    const newRecord = await db.insert(componentInteractions)
      .values({
        componentType,
        interactionType,
        data: body.data || null,
        timestamp: currentTimestamp,
        createdAt: currentTimestamp
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
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

    // Check if record exists
    const existingRecord = await db.select()
      .from(componentInteractions)
      .where(eq(componentInteractions.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Component interaction not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and sanitize componentType if provided
    if (body.componentType !== undefined) {
      const componentType = body.componentType.toString().trim();
      if (!componentType) {
        return NextResponse.json({ 
          error: "componentType cannot be empty",
          code: "EMPTY_COMPONENT_TYPE" 
        }, { status: 400 });
      }
      updates.componentType = componentType;
    }

    // Validate and sanitize interactionType if provided
    if (body.interactionType !== undefined) {
      const interactionType = body.interactionType.toString().trim();
      if (!interactionType) {
        return NextResponse.json({ 
          error: "interactionType cannot be empty",
          code: "EMPTY_INTERACTION_TYPE" 
        }, { status: 400 });
      }
      updates.interactionType = interactionType;
    }

    // Handle optional fields
    if (body.data !== undefined) {
      updates.data = body.data;
    }

    if (body.timestamp !== undefined) {
      updates.timestamp = body.timestamp;
    }

    const updated = await db.update(componentInteractions)
      .set(updates)
      .where(eq(componentInteractions.id, parseInt(id)))
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

    // Check if record exists
    const existingRecord = await db.select()
      .from(componentInteractions)
      .where(eq(componentInteractions.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Component interaction not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(componentInteractions)
      .where(eq(componentInteractions.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Component interaction deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}