const db = require('../config/db');

const Project = {
  findAll: async () => {
    const res = await db.query("SELECT * FROM projects ORDER BY display_order ASC, created_at DESC");
    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      longDescription: row.long_description,
      techStack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
      image: row.image,
      gallery: row.gallery ? JSON.parse(row.gallery) : [],
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      category: row.category,
      categoryDescription: row.category_description,
      isFeatured: row.is_featured,
      displayOrder: row.display_order,
      createdAt: row.created_at
    }));
  },

  findById: async (id) => {
    const res = await db.query("SELECT * FROM projects WHERE id = $1", [id]);
    const row = res.rows[0];
    if (row) {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        longDescription: row.long_description,
        techStack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
        image: row.image,
        gallery: row.gallery ? JSON.parse(row.gallery) : [],
        githubUrl: row.github_url,
        liveUrl: row.live_url,
        category: row.category,
        categoryDescription: row.category_description,
        isFeatured: row.is_featured,
        displayOrder: row.display_order,
        createdAt: row.created_at
      };
    }
    return null;
  },

  create: async (project) => {
    const {
      title, description, longDescription, techStack,
      image, gallery, githubUrl, liveUrl, category,
      categoryDescription,
      isFeatured, displayOrder
    } = project;

    const sql = `
      INSERT INTO projects (
        title, description, long_description, tech_stack, 
        image, gallery, github_url, live_url, category, 
        category_description,
        is_featured, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;
    const params = [
      title, description, longDescription || null, JSON.stringify(techStack || []),
      image || null, JSON.stringify(gallery || []), githubUrl || null, liveUrl || null, category,
      categoryDescription || null,
      !!isFeatured, displayOrder || 0
    ];

    const res = await db.query(sql, params);
    return { id: res.rows[0].id, ...project };
  },

  update: async (id, project) => {
    const {
      title, description, longDescription, techStack,
      image, gallery, githubUrl, liveUrl, category,
      categoryDescription,
      isFeatured, displayOrder
    } = project;

    const sql = `
      UPDATE projects SET 
        title = $1, description = $2, long_description = $3, tech_stack = $4, 
        image = $5, gallery = $6, github_url = $7, live_url = $8, 
        category = $9, category_description = $10, is_featured = $11, display_order = $12
      WHERE id = $13
    `;
    const params = [
      title, description, longDescription || null, JSON.stringify(techStack || []),
      image || null, JSON.stringify(gallery || []), githubUrl || null, liveUrl || null, category,
      categoryDescription || null,
      !!isFeatured, displayOrder || 0, id
    ];

    await db.query(sql, params);
    return { id, ...project };
  },

  delete: async (id) => {
    await db.query("DELETE FROM projects WHERE id = $1", [id]);
    return { id };
  }
};

module.exports = Project;