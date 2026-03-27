const Database = require('better-sqlite3');
const db = new Database('data.db');

const comments = db.prepare('SELECT id, body FROM comments').all();
const update = db.prepare('UPDATE comments SET body = ? WHERE id = ?');

// Names ordered longest-first to avoid partial replacements
const names = ['James Strange', 'Sage & Stone', 'William', 'Rachel', 'Karen', 'Derek', 'James', 'Ryan', 'Reid'];

let changed = 0;
const tx = db.transaction(() => {
  for (const c of comments) {
    let body = c.body;

    for (const name of names) {
      // Don't double-@
      if (body.includes('@' + name)) continue;

      // Escape special chars for regex
      const esc = name.replace(/[&]/g, '\\&');

      // Match the name when it appears as a person reference (not inside another word)
      // Lookbehind: start of string, or after space, slash, comma, semicolon, dash
      // Lookahead: space, dash, comma, colon, semicolon, slash, question mark, period, end of string
      const re = new RegExp('(?:^|(?<=[ /,;]))' + esc + '(?=[ \\u2013\\-,;:/?.]|$)', 'gm');
      body = body.replace(re, '@' + name);
    }

    // Handle "James &" -> was already caught by "James Strange" above
    // Handle standalone "James" that should be "@James Strange" — already in names list

    if (body !== c.body) {
      update.run(body, c.id);
      changed++;
      console.log(`  [${c.id}] ${c.body.substring(0, 70)}`);
      console.log(`     → ${body.substring(0, 70)}`);
    }
  }
});
tx();

console.log(`\nUpdated ${changed} of ${comments.length} comments`);
db.close();
