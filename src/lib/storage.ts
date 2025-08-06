import { prisma } from './db'
import fs from 'fs'
import path from 'path'

interface SiteData {
  id: string
  title: string
  files: Record<string, string>
  createdAt: Date
}

const STORAGE_DIR = path.join(process.cwd(), 'sites')

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true })
}

export async function saveSite(files: Record<string, string | { code: string }>, title: string = 'Untitled Site', userId: string): Promise<{ id: string; url: string }> {
  try {
    console.log('Saving site with userId:', userId, 'title:', title)
    console.log('Files to save:', JSON.stringify(files, null, 2))
    
    const processedFiles = Object.fromEntries(
      Object.entries(files).map(([name, content]) => {
        let fileContent: string;
        if (typeof content === 'string') {
          fileContent = content;
        } else if (content && typeof content === 'object' && 'code' in content) {
          fileContent = content.code;
        } else {
          console.warn('Unexpected file content format for:', name, content);
          fileContent = String(content);
        }
        console.log(`Processing file ${name}:`, { original: content, processed: fileContent.substring(0, 100) });
        return [name, fileContent];
      })
    );
    
    console.log('Processed files for database:', Object.keys(processedFiles))
    
    const site = await prisma.site.create({
      data: {
        title,
        userId,
        files: {
          create: Object.entries(processedFiles).map(([name, content]) => ({
            name,
            content: typeof content === 'string' ? content : String(content)
          }))
        }
      }
    })
    
    console.log('Site saved successfully:', site.id)
    return { id: site.id, url: `/site/${site.id}` }
  } catch (error) {
    console.warn('Database save failed, using file storage:', error)
    
    const processedFiles = Object.fromEntries(
      Object.entries(files).map(([name, content]) => {
        let fileContent: string;
        if (typeof content === 'string') {
          fileContent = content;
        } else if (content && typeof content === 'object' && 'code' in content) {
          fileContent = content.code;
        } else {
          console.warn('Unexpected file content format for:', name, content);
          fileContent = String(content);
        }
        return [name, fileContent];
      })
    );
    
    const id = generateUUID4()
    const siteData: SiteData = {
      id,
      title,
      files: processedFiles,
      createdAt: new Date()
    }
    
    const filePath = path.join(STORAGE_DIR, `${id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(siteData, null, 2))
    
    return { id, url: `/site/${id}` }
  }
}

export async function getSite(id: string): Promise<SiteData | null> {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
      include: { files: true }
    })
    
    if (site) {
      const files = Object.fromEntries(site.files.map((f: any) => {
        let content: string;
        if (typeof f.content === 'string') {
          content = f.content;
        } else if (f.content && typeof f.content === 'object' && 'code' in f.content) {
          content = f.content.code;
        } else {
          content = String(f.content);
        }
        return [f.name, content];
      }));
      
      return {
        id: site.id,
        title: site.title || 'Untitled Site',
        files,
        createdAt: site.createdAt
      }
    }
  } catch (error) {
    console.warn('Database read failed, trying file storage:', error)
  }
  
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`)
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('File storage read failed:', error)
  }
  
  return null
}

function generateUUID4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
} 