import { getLocalProjects } from '../src/data/localDatabase';
import fs from 'fs';
import path from 'path';

function escapeSql(str: string | undefined | null) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeArray(arr: string[] | undefined) {
  if (!arr || arr.length === 0) return 'NULL';
  const escaped = arr.map(item => `"${item.replace(/"/g, '""')}"`).join(',');
  return `'{${escaped}}'`;
}

function generateSql() {
  const projects = getLocalProjects();
  let sql = '-- Data migration from localDatabase.ts\n\n';

  // For photos
  const photos = projects.filter(p => p.category === 'photo');
  if (photos.length > 0) {
    sql += 'INSERT INTO public.photos (id, title, description, category, subcategory, media_url, thumbnail_url, upload_date, tags, featured, photo_categories, auto_tags) VALUES\n';
    
    const values = photos.map(p => {
      return `(
        ${escapeSql(p.id)},
        ${escapeSql(p.title)},
        ${escapeSql(p.description)},
        ${escapeSql(p.category)},
        ${escapeSql(p.subcategory)},
        ${escapeSql(p.mediaUrl)},
        ${escapeSql(p.thumbnailUrl)},
        '${p.uploadDate.toISOString()}',
        ${escapeArray(p.tags)},
        ${p.featured ? 'true' : 'false'},
        ${escapeArray(p.photoCategories)},
        ${escapeArray(p.autoTags)}
      )`;
    });

    sql += values.join(',\n') + ';\n\n';
  }

  // Determine the next timestamp string for the migration
  const timestamp = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
  const filepath = path.join(__dirname, '..', 'supabase', 'migrations', `${timestamp}_data_migration.sql`);
  
  fs.writeFileSync(filepath, sql);
  console.log(`Generated migration: ${filepath}`);
}

generateSql();
