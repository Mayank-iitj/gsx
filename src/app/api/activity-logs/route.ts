import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activityLogs, users } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(activityLogs)
        .where(eq(activityLogs.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Activity log not found' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(activityLogs);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(activityLogs.action, `%${search}%`),
          like(activityLogs.description, `%${search}%`)
        )
      );
    }

    if (userId) {
      conditions.push(eq(activityLogs.userId, parseInt(userId)));
    }

    if (action) {
      conditions.push(eq(activityLogs.action, action));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortOrder = order === 'asc' ? asc : desc;
    if (sort === 'timestamp') {
      query = query.orderBy(sortOrder(activityLogs.timestamp));
    } else if (sort === 'action') {
      query = query.orderBy(sortOrder(activityLogs.action));
    } else {
      query = query.orderBy(sortOrder(activityLogs.createdAt));
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
    const { userId, action, description } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ 
        error: "action is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: "description is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      userId: parseInt(userId),
      action: action.toString().trim(),
      description: description.toString().trim(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const newRecord = await db.insert(activityLogs)
      .values(sanitizedData)
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
    const existing = await db.select()
      .from(activityLogs)
      .where(eq(activityLogs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Activity log not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { userId, action, description } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (userId !== undefined) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }

      // Validate user exists
      const userExists = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (userExists.length === 0) {
        return NextResponse.json({ 
          error: "User not found",
          code: "USER_NOT_FOUND" 
        }, { status: 400 });
      }

      updates.userId = parseInt(userId);
    }

    if (action !== undefined) {
      updates.action = action.toString().trim();
    }

    if (description !== undefined) {
      updates.description = description.toString().trim();
    }

    // Always update timestamp for activity logs
    updates.timestamp = new Date().toISOString();

    const updated = await db.update(activityLogs)
      .set(updates)
      .where(eq(activityLogs.id, parseInt(id)))
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
    const existing = await db.select()
      .from(activityLogs)
      .where(eq(activityLogs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Activity log not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(activityLogs)
      .where(eq(activityLogs.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Activity log deleted successfully',
      deletedRecord: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}