const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  DROP TABLE IF EXISTS attachments;
  DROP TABLE IF EXISTS comments;
  DROP TABLE IF EXISTS activity_log;
  DROP TABLE IF EXISTS tasks;

  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    correction_index INTEGER DEFAULT 0,
    city_comment TEXT NOT NULL,
    owner TEXT NOT NULL,
    informed TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL REFERENCES tasks(id),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const insert = db.prepare(`
  INSERT INTO tasks (category, correction_index, city_comment, owner, informed, status, notes, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// correction_index maps to the comment number in the corrections viewer (1-based)
// Owner is the single person responsible. Informed are others who need visibility.

const tasks = [
  // ===== ORDINANCE (7 comments in PDF, but #1 is "no action required") =====
  // PDF comment 2
  { cat: 'Ordinance', ci: 2, comment: 'Sheet A4 - SRC R302.7 - Enclosed spaces under stairs accessed by a door shall have walls, under-stair surface and any soffits protected on the enclosed side with 1/2" gypsum board.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 1 },
  // PDF comment 3
  { cat: 'Ordinance', ci: 3, comment: 'Sheet A4, Garage note 1 - SRC R302.5 and R302.6 - Clarify that at habitable rooms above the garage, a minimum 5/8-inch Type X gypsum board ceiling is required to provide fire separation from the garage and dwelling unit.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 1 },
  // PDF comment 4
  { cat: 'Ordinance', ci: 4, comment: 'Sheet A5 - SRC R408.4 – Show crawl space access on the plans via openings in the floor or through the foundation walls. Openings shall be 18"x24" minimum through floors, and 16"x24" minimum through walls. If below grade a 16"x24" minimum area-way is required.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 1 },
  // PDF comment 5
  { cat: 'Ordinance', ci: 5, comment: 'Sheet A5 - SRC R311.7 - Provide notes or details that clearly show the following basic stair dimensions for each stair run in the plans.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 1 },
  // PDF comment 6
  { cat: 'Ordinance', ci: 6, comment: 'Sheet A6 - SRC R308.4 - Clearly indicate on the plans each location where safety glazing is required. See the following locations of concern: SRC R308.4.2 - The window in the plane of the door within 24 inches of the door jamb.',
    owner: 'Karen', informed: '', status: 'in_progress', notes: 'Karen – Notation has been made but, waiting for interactive set to verify location of window in question.', order: 1 },
  // PDF comment 7
  { cat: 'Ordinance', ci: 7, comment: 'Sheet A7 - Specify if the roof assembly is vented or unvented, and provide one of the following.',
    owner: 'Karen', informed: 'Reid', status: 'completed', notes: 'Karen – completed', order: 1 },

  // ===== STRUCTURAL (4 comments in PDF, #1 is "no action required") =====
  // PDF comment 2
  { cat: 'Structural', ci: 2, comment: 'SBC 1704.2 - Complete and return the SDCI Statement of Structural Special Inspections, signed by the owner or engineer or architect acting as the owner\'s agent. The designated special inspection agency shall be WABO registered.',
    owner: 'Reid', informed: 'Ryan, Karen', status: 'pending', notes: 'Reid/Ryan – Waiting to hear from Reid on who he would like to use for this. BTL has some recommendations.', order: 2 },
  // PDF comment 3
  { cat: 'Structural', ci: 3, comment: 'Sheet S2.1 - ASCE 7-16, Section 12.13.9.2.1.1 – On sites with liquefiable soil, isolated spread footings are required to be interconnected with foundation ties. Add ties as required.',
    owner: 'Ryan', informed: 'Karen', status: 'in_progress', notes: 'Ryan – in progress', order: 2 },
  // PDF comment 4
  { cat: 'Structural', ci: 4, comment: 'Detail 16/S3.4 - Where the gypsum board ceiling is intended to function as a diaphragm to brace exterior walls for out-of-plane loads, provide structural calculations demonstrating adequacy. Specify panel orientation, required blocking, fastening schedule, and connection of ceiling diaphragm to exterior walls.',
    owner: 'Ryan', informed: 'Karen', status: 'in_progress', notes: 'Ryan – in progress', order: 2 },

  // ===== ENERGY (7 comments in PDF) =====
  // PDF comment 1
  { cat: 'Energy', ci: 1, comment: 'Identify the cooking range type and indicate 160 CFM for an electric range and 250 CFM if the range is gas per Table M1505.4.4.3.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 3 },
  // PDF comment 2
  { cat: 'Energy', ci: 2, comment: 'M1505.4.3.1 Ventilation quality adjustment. The minimum whole house ventilation rate shall be adjusted by the system coefficient in Table M1505.4.3(2). Show the calculation on the drawings. (Typical) Revise and resubmit.',
    owner: 'Reid', informed: 'Karen', status: 'pending', notes: 'Karen/Reid – waiting on information from Mech contractor about how the system is going to provide this.', order: 3 },
  // PDF comment 3
  { cat: 'Energy', ci: 3, comment: 'SRC M1505.4: It appears that the whole house ventilation is provided by the local exhaust fan(s). Identify the fan on the drawing. Specify Fan CFM and mode of operation as continuous or intermittent.',
    owner: 'Karen', informed: 'Reid', status: 'in_progress', notes: 'Karen – completed (Fan location in laundry room called out at 120cfm). Waiting for information if it will be intermittent or continuous based on system installed.', order: 3 },
  // PDF comment 4
  { cat: 'Energy', ci: 4, comment: 'SRC M1505.4.3: Indicate on the drawings whether the whole house ventilation system will operate continuously or intermittently. Provide run-time percentage or minimum ventilation CFM per applicable table.',
    owner: 'Karen', informed: 'Reid', status: 'pending', notes: 'Karen – Waiting for information if it will be intermittent or continuous based on system installed.', order: 3 },
  // PDF comment 5
  { cat: 'Energy', ci: 5, comment: 'Add the U-value for the fenestration in-line with the compliance path chosen (Typical).',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 3 },
  // PDF comment 6
  { cat: 'Energy', ci: 6, comment: 'Revise the slab on grade insulation to extend a minimum of 4\'-0" with a R-5 thermal break at the wall. (Typical)',
    owner: 'Reid', informed: 'Karen, Ryan', status: 'in_progress', notes: 'Karen/Ryan/Reid – working on solution on how to provide this with pin piles. Is there another way to accomplish this without insulation under slab??', order: 3 },
  // PDF comment 7
  { cat: 'Energy', ci: 7, comment: 'Whole House Ventilation using Heat Recovery system requires a full detail shown on the drawing for the review and inspection verification purpose.',
    owner: 'Reid', informed: 'Karen', status: 'pending', notes: 'Karen/Reid – waiting on information from Mech contractor about how the system is going to provide this.', order: 3 },

  // ===== ZONING (6 comments in PDF) =====
  // PDF comment 1
  { cat: 'Zoning', ci: 1, comment: 'Miscellaneous: Please update with construction permit number.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 4 },
  // PDF comment 2
  { cat: 'Zoning', ci: 2, comment: 'SMC 23.44.011 (Floor Area Ratio): Per Table A for 23.44.011, the FAR allowed is 0.6. Please update calculation to this FAR.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 4 },
  // PDF comment 3
  { cat: 'Zoning', ci: 3, comment: '23.60A.574 Lot Coverage in UR Environment: Per 23.60A.574.B.1, lot coverage for shoreline is based on dry land portion. Provide a separate lot coverage calculation based on shoreline standards.',
    owner: 'Karen', informed: '', status: 'completed', notes: 'Karen – completed', order: 4 },
  // PDF comment 4
  { cat: 'Zoning', ci: 4, comment: 'SMC 23.44.020 (Tree Requirements): General Compliance: Demonstrate compliance with tree requirements. Include identifying tree locations, species, size, caliper inches calculation, and a table of which trees satisfy the standard.',
    owner: 'Karen', informed: 'Derek', status: 'pending', notes: 'Karen & Derek – Confirm which tree to dedicate for retention.', order: 4 },
  // PDF comment 5
  { cat: 'Zoning', ci: 5, comment: 'SMC 23.44.020 (Tree Requirements): Street Trees: Show location, size, and type of proposed street trees per SMC 23.44.020.C.1. Obtain conceptual approval from SDOT and provide proof of approval.',
    owner: 'William', informed: 'Karen, Sage & Stone', status: 'pending', notes: 'William – submit Urban Forestry permit. Sage & Stone may want to weigh in on selection and location.', order: 4 },
  // PDF comment 6
  { cat: 'Zoning', ci: 6, comment: '23.60A.167 / 23.60A.206: Site has a code interpretation being reviewed on the determined setback based on string line measurements from neighboring properties. Pending land use interpretation results.',
    owner: 'William', informed: 'Karen', status: 'pending', notes: 'William – Prepare narrative, submit to team, then call with Travis before submitting formal response.', order: 4 },

  // ===== LAND USE / SHORELINE (6 comments in PDF) =====
  // PDF comment 1
  { cat: 'Land Use / Shoreline', ci: 1, comment: 'Construction drawings for Shoreline projects must accurately depict the Shoreline Environment, including boundaries and relevant shoreline features. Shoreline District is Urban Residential and Conservancy Recreation.',
    owner: 'Karen', informed: '', status: 'pending', notes: 'Karen – add a zoning overlay to C1 and C2 sheets. Indicate shoreline environment.', order: 5 },
  // PDF comment 2
  { cat: 'Land Use / Shoreline', ci: 2, comment: 'Depict on relevant site plans any and all Shoreline BMPs related to construction zones and construction staging areas to prevent deleterious and waste material from entering shoreline habitat.',
    owner: 'William', informed: 'Sage & Stone, Karen', status: 'pending', notes: 'William/Sage & Stone – part of mitigation plan and BMPs.', order: 5 },
  // PDF comment 3
  { cat: 'Land Use / Shoreline', ci: 3, comment: 'Depict on appropriate site plans the location of any construction staging area and how it will be fitted with BMPs.',
    owner: 'Karen', informed: 'William', status: 'pending', notes: 'Karen – call out staging area on C2 sheet.', order: 5 },
  // PDF comment 4
  { cat: 'Land Use / Shoreline', ci: 4, comment: 'Specify on plans: equipment using oil, gasoline, or diesel on site shall be checked daily for evidence of leakage.',
    owner: 'William', informed: 'Rachel, Karen', status: 'pending', notes: 'William – on mitigation plan? Rachel – on any of her submittal documents? Karen – does any of this need to be on the C2 Site plan if it\'s part of other submittals?', order: 5 },
  // PDF comment 5
  { cat: 'Land Use / Shoreline', ci: 5, comment: 'Add a note on the plans: the owner(s), builder(s), or responsible party(s) shall follow BMPs and an Emergency Containment plan to prevent debris from entering the water during construction.',
    owner: 'Karen', informed: 'William', status: 'pending', notes: 'Karen – Add note to C1 Sheet. William – include ECP plan in re-submittal.', order: 5 },
  // PDF comment 6
  { cat: 'Land Use / Shoreline', ci: 6, comment: 'Provide calculation for existing and proposed impervious surface (including paths and steps in shoreline setback) and show any changes to vegetation. Increase in impervious surface triggers need for mitigation plan per SMC 23.60A.190.',
    owner: 'William', informed: 'Sage & Stone, Rachel', status: 'pending', notes: 'Sage & Stone/William – Will need landscape plan completed and client approved in order to complete this. Rachel – These numbers will impact her OSM.', order: 5 },

  // ===== ECA / GEOTECH (14 comments in PDF) =====
  // PDF comment 1
  { cat: 'ECA / Geotech', ci: 1, comment: 'SMC 22.170.110 A.1. Geotechnical report references potential MSE wall for driveway expansion. Clarify if this will be included in current scope. Include on plan set and provide calculations.',
    owner: 'Reid', informed: 'Karen, Rachel', status: 'pending', notes: 'Will discuss with Reid. Civil to generate wall design based on Geo report if needed.', order: 6 },
  // PDF comment 2
  { cat: 'ECA / Geotech', ci: 2, comment: 'SMC 25.09.080. Complete stabilization of all portions of site which are disturbed. Decks or structural overhangs over steep slopes must not concentrate rainfall or contribute to instability. Provide additional recommendations from geotech engineer.',
    owner: 'James Strange', informed: 'Karen', status: 'pending', notes: 'James Strange – simple narrative addition to Geotech Report.', order: 6 },
  // PDF comment 3
  { cat: 'ECA / Geotech', ci: 3, comment: 'Include details for subsurface drainage system consistent with recommendations from geotechnical engineer.',
    owner: 'Karen', informed: 'Reid', status: 'pending', notes: 'Karen – get notes from Reid. Verify subsurface and footing drains reflect Geo recommendations.', order: 6 },
  // PDF comment 4 (combined temp excavation + cut slopes)
  { cat: 'ECA / Geotech', ci: 4, comment: 'SMC 22.170.200 B. Provide temporary excavation plan: lateral extents of excavations in relation to property line, top/bottom of excavation elevation, and maximum cut slopes.',
    owner: 'Karen', informed: 'Rachel', status: 'pending', notes: 'Karen – create separate page for this. Show wall/footing section details near property lines reflecting temp-ex cut depth per Geo report.', order: 6 },
  // PDF comment 4 (cut slopes is part of same PDF comment)
  { cat: 'ECA / Geotech', ci: 4, comment: 'As drawn on architectural elevation views, cut slopes are steeper than 1H:1V. Note loose to medium dense soils in geotechnical borings.',
    owner: 'Karen', informed: '', status: 'pending', notes: 'Karen – make notation on drawings.', order: 6 },
  // PDF comment 5
  { cat: 'ECA / Geotech', ci: 5, comment: 'SBC 1613.3.3. Where liquefiable soils are present, the site class must be listed as Site Class F.',
    owner: 'Ryan', informed: 'Karen, James Strange', status: 'pending', notes: 'Ryan – Site Class F per Seattle\'s special addendum. Will change structural factors. Karen to email info to Ryan.', order: 6 },
  // PDF comment 6
  { cat: 'ECA / Geotech', ci: 6, comment: 'SMC 22.170.110A. Provide notes on plans for installation and field testing requirements for pin piles, including ASTM D 1143-81 testing statement and minimum pile embedment length.',
    owner: 'Ryan', informed: 'Karen', status: 'pending', notes: 'Ryan? – Karen will email Ryan to ask about this.', order: 6 },
  // PDF comment 7
  { cat: 'ECA / Geotech', ci: 7, comment: 'SMC 25.09.100. Clarify how down drag was considered on allowable pin pile capacity.',
    owner: 'Ryan', informed: '', status: 'pending', notes: 'Ryan – Pin Pile Design? Update to calcs or rebuttal.', order: 6 },
  // PDF comment 8
  { cat: 'ECA / Geotech', ci: 8, comment: 'SMC 25.09.100. Provide a geotechnical addendum with evaluation of liquefaction hazards, including differential settlement and lateral spreading. Provide justification for values used in lateral spreading analysis (average fines content).',
    owner: 'James Strange', informed: 'Ryan', status: 'pending', notes: 'James & Ryan – This is a geotechnical addendum. Ryan (BTL) will observe change in values and add differential settlement.', order: 6 },
  // PDF comment 9
  { cat: 'ECA / Geotech', ci: 9, comment: 'Add notes to Temporary Erosion/Sedimentation Control Plan: site visit requirements from Geotechnical Special Inspector during active grading and significant rainfall (Nov 1 - Mar 31), field report requirements to SDCI.',
    owner: 'Rachel', informed: 'James Strange, Karen', status: 'pending', notes: 'Rachel – can she provide a TESC? James – needs to be aware of this observation. Karen – will follow up with emails about this.', order: 6 },
  // PDF comment 10
  { cat: 'ECA / Geotech', ci: 10, comment: 'SMC 22.170.080 C. Recorded Liquefaction-Prone Area Covenant required prior to permit issuance. Upload draft of unsigned/unrecorded covenant for reviewer to check.',
    owner: 'James Strange', informed: 'William, Karen', status: 'pending', notes: 'James? to provide; William to submit; Karen to email William to inquire.', order: 6 },
  // PDF comment 11
  { cat: 'ECA / Geotech', ci: 11, comment: 'SMC 22.170.190 A. Provide a signed/stamped letter from geotech engineer with review of plans and minimal risk statement per Director\'s Rule 5-2016.',
    owner: 'James Strange', informed: '', status: 'pending', notes: '', order: 6 },
  // PDF comment 12
  { cat: 'ECA / Geotech', ci: 12, comment: 'SMC 22.170.080 C. Recorded Landslide-Prone Area Covenant required prior to permit issuance. Upload draft of unsigned/unrecorded covenant for reviewer to check.',
    owner: 'James Strange', informed: 'William', status: 'pending', notes: 'Repeat comment from no. 10?? Same process as Liquefaction covenant.', order: 6 },
  // PDF comment 13
  { cat: 'ECA / Geotech', ci: 13, comment: 'SMC 25.09.330 B.1. Provide a note on the plan that the site is designated as a potential slide area due to geologic conditions.',
    owner: 'Karen', informed: '', status: 'pending', notes: '', order: 6 },
  // PDF comment 14
  { cat: 'ECA / Geotech', ci: 14, comment: 'SMC 22.170.130. Nominate a geotechnical engineering firm on the SDCI Geotechnical Special Inspections Schedule form. Must be signed by the owner or owner\'s representative.',
    owner: 'William', informed: 'James Strange', status: 'pending', notes: 'James and/or William.', order: 6 },

  // ===== REVEGETATION (6 comments in PDF) =====
  // PDF comment 1
  { cat: 'Revegetation', ci: 1, comment: 'Map the Potential Slide ECA area on plans. Note: mitigation sequencing is not needed in potential slide ECA. Revegetation standards do not apply in shoreline areas.',
    owner: 'Karen', informed: 'William, Sage & Stone', status: 'in_progress', notes: 'Karen – have received back revised survey from Terrane with ECA and buffers noted. Will include this updated survey with re-submittal.', order: 7 },
  // PDF comment 2
  { cat: 'Revegetation', ci: 2, comment: 'Project reviewed for consistency with SMC 25.09.070 (Vegetation and Impervious Surface Management). If disturbance in ECAs/buffers impacts trees/vegetation, mitigation and revegetation requirements apply.',
    owner: 'William', informed: 'Sage & Stone', status: 'pending', notes: 'William – Work with Sage & Stone to complete.', order: 7 },
  // PDF comment 3 (existing conditions plan has sub-items a-d — split into tasks per Karen's doc)
  { cat: 'Revegetation', ci: 3, comment: 'Provide existing conditions plan: Delineate and label the ECA.',
    owner: 'Karen', informed: 'William', status: 'pending', notes: 'Karen – will transpose information from updated survey to C1 and C2 sheets. Will include new survey as resubmittal.', order: 7 },
  { cat: 'Revegetation', ci: 3, comment: 'Brief description/identification of existing ground coverage within the area of temporary and permanent disturbance in the ECA (lawn, landscaping, invasive species, patio, pathway, etc.).',
    owner: 'William', informed: 'Sage & Stone, Karen', status: 'pending', notes: 'William/Sage & Stone/Karen? – should I include this somewhere on the C1 sheet or should this be part of the mitigation plan?', order: 7 },
  { cat: 'Revegetation', ci: 3, comment: 'Locations of all existing trees within and adjacent to disturbance area. Include tree genus, species, and dripline diameter. Number trees consistently across all plan sheets.',
    owner: 'William', informed: 'Sage & Stone, Karen', status: 'pending', notes: 'William/Sage & Stone/Karen? – C3 sheet?', order: 7 },
  { cat: 'Revegetation', ci: 3, comment: 'Summary narrative of existing ecological functions performed by trees and vegetation within the ECA (habitat, soil stabilization, stormwater filtering, etc.).',
    owner: 'William', informed: 'Sage & Stone', status: 'pending', notes: '', order: 7 },
  // PDF comment 4
  { cat: 'Revegetation', ci: 4, comment: 'Provide documentation of mitigation sequencing per SMC 25.09.065. Brief narrative documenting how mitigation sequencing was considered in project design and construction.',
    owner: 'William', informed: 'Sage & Stone', status: 'pending', notes: '', order: 7 },
  // PDF comment 5
  { cat: 'Revegetation', ci: 5, comment: 'Delineate total area/sq ft of permanent development and temporary construction disturbance within the ECA. Show all trees proposed for removal. Calculate total area of impact requiring mitigation.',
    owner: 'William', informed: 'Sage & Stone, Rachel', status: 'pending', notes: 'William / Sage & Stone / Rachel – Use updated CSC sheet from Rachel for mitigation plan.', order: 7 },
  // PDF comment 6
  { cat: 'Revegetation', ci: 6, comment: 'Provide a mitigation (revegetation/restoration) plan: location and sq ft of mitigation area, species/size/quantities/spacing, and narrative describing how plan compensates for ecological loss.',
    owner: 'William', informed: 'Sage & Stone', status: 'pending', notes: '', order: 7 },

  // ===== DRAINAGE (4 comments in PDF) =====
  // PDF comment 1
  { cat: 'Drainage', ci: 1, comment: 'OSM Calculator Summary Sheet is incomplete: Add SDCI permit number, total new plus replaced landscaping to match SA area on CSC plan, total existing hard surface area.',
    owner: 'William', informed: 'Rachel, Sage & Stone', status: 'pending', notes: 'William – email Rachel to verify current storm water impervious maximum. Sage & Stone/Rachel – When Sage & Stone have the updated per the client approved design impervious number, Rachel is to update OSM accordingly.', order: 8 },
  // PDF comment 2
  { cat: 'Drainage', ci: 2, comment: 'A build-over agreement may be required with SPU for this project. The SPU Mainline is located onsite. See Tip 507 for instructions. Submit Request for Build-over Review application to SPU DSO.',
    owner: 'William', informed: 'Karen', status: 'pending', notes: 'William – email the DSO office to get in contact, prepare the build over form, and show the cross section (show we aren\'t putting earth pressure over the pipe).', order: 8 },
  // PDF comment 3
  { cat: 'Drainage', ci: 3, comment: 'All Civil Drainage Plan sheets & Drainage Report must be stamped & signed by a licensed Civil PE.',
    owner: 'Rachel', informed: 'William', status: 'pending', notes: 'Rachel – stamp (I did see it on the drainage report...).', order: 8 },
  // PDF comment 4
  { cat: 'Drainage', ci: 4, comment: 'Drainage Review approval is for private property stormwater only. SPU will conduct sanitary side sewer review under a separate permit. Please add a large boxed note to indicate that.',
    owner: 'Derek', informed: 'Reid', status: 'pending', notes: 'Derek – ask Reid to scope the side sewer, and give us elevation of the main.', order: 8 },

  // ===== SCL (2 comments in PDF) =====
  // PDF comment 1
  { cat: 'SCL (City Light)', ci: 1, comment: 'Service connection may be delayed if Seattle City Light requirements have not been met. Contact ESR Shayna Sproles (206-867-1174, shayna.sproles@seattle.gov) for questions and coordination.',
    owner: 'William', informed: '', status: 'in_progress', notes: 'William – completed? Already contacted Shayna, should get feedback 2nd week of March.', order: 9 },
  // PDF comment 2
  { cat: 'SCL (City Light)', ci: 2, comment: 'SCL records indicate an existing easement over/near the West property line. Confirm with SCL Real Estate Services and show correct location of easement and existing service. No permanent structures within SCL power easement without prior written consent.',
    owner: 'William', informed: 'Karen', status: 'completed', notes: 'Karen/William – completed. Will provide Terrane survey with all easements showing hatched as part of the re-submittal.', order: 9 },

  // ===== FIRE (3 comments in PDF, #2 is just a code reference note) =====
  // PDF comment 1
  { cat: 'Fire', ci: 1, comment: 'Revise the plans to show either a) installation of a NFPA 13D sprinkler system, or b) construction of a fire apparatus access road per 2021 Seattle Fire Code section 503.',
    owner: 'Karen', informed: 'Reid', status: 'pending', notes: 'Karen – Add notation that sprinklers are required. Reid – Provide fire suppression drawings for separate sprinkler permit.', order: 10 },
  // PDF comment 3
  { cat: 'Fire', ci: 3, comment: 'Revise the plans to show installation of a NFPA 13D sprinkler system as required by 2021 Seattle Fire Code section 903.',
    owner: 'Karen', informed: 'Reid', status: 'pending', notes: 'Karen – Add notation that sprinklers are required. Reid – Provide fire suppression drawings for separate sprinkler permit.', order: 10 },
];

const insertComment = db.prepare(`
  INSERT INTO comments (task_id, author, body, created_at) VALUES (?, ?, ?, datetime('now'))
`);

const insertMany = db.transaction((tasks) => {
  for (const t of tasks) {
    // Store task without notes — Karen's notes become comments
    insert.run(t.cat, t.ci, t.comment, t.owner, t.informed, t.status, '', t.order);
    const taskId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    // Insert Karen's notes as the first comment from Karen
    if (t.notes && t.notes.trim()) {
      insertComment.run(taskId, 'Karen', t.notes);
    }
  }
});

insertMany(tasks);

const count = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
console.log(`Seeded ${count} tasks.`);

// Summary by owner
const byOwner = db.prepare(`
  SELECT owner, status, COUNT(*) as c FROM tasks GROUP BY owner, status ORDER BY owner, status
`).all();
console.log('\nBy owner:');
let last = '';
byOwner.forEach(r => {
  if (r.owner !== last) { console.log(`\n  ${r.owner}:`); last = r.owner; }
  console.log(`    ${r.status}: ${r.c}`);
});

db.close();
