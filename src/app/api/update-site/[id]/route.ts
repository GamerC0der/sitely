import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { files } = await request.json();

    const updatedFiles = Object.entries(files).map(([name, content]) => ({
      name,
      content: typeof content === 'string' ? content : String(content)
    }));

    await prisma.file.deleteMany({
      where: { siteId: resolvedParams.id }
    });

    await prisma.file.createMany({
      data: updatedFiles.map(file => ({
        siteId: resolvedParams.id,
        name: file.name,
        content: file.content
      }))
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Site updated successfully' 
    });
  } catch (error) {
    console.error('Update site error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site' },
      { status: 500 }
    );
  }
} 