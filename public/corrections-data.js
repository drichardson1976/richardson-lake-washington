// Structured data from all 10 City of Seattle correction PDFs
// Each category maps to its correction comments with index numbers matching task.correction_index
const CORRECTIONS_DATA = {
  'Ordinance': {
    title: '7088950-CN Ordinance Cycle 1',
    reviewer: 'David Aguilera',
    email: 'david.aguilera@seattle.gov',
    phone: '206-684-7715',
    date: '2-20-2026',
    pdf: 'Corrections - ORDINANCE - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: '00 Code Edition', page: 'Sheet A4', text: 'This project has been reviewed for conformance with one or more of the following codes: 2021 Seattle Residential Code (SRC)', noAction: true },
      { index: 2, subject: 'SRC R302.7', page: 'Sheet A4', text: 'SRC R302.7 - Enclosed spaces under stairs accessed by a door shall have walls, under-stair surface and any soffits protected on the enclosed side with 1/2" gypsum board.' },
      { index: 3, subject: 'SRC R302.5 / R302.6', page: 'Sheet A4, Garage note 1', text: 'SRC R302.5 and R302.6 - Clarify that at habitable rooms above the garage, a minimum 5/8-inch Type X gypsum board ceiling is required to provide fire separation from the garage and dwelling unit.' },
      { index: 4, subject: 'SRC R408.4', page: 'Sheet A5', text: 'SRC R408.4 – Show crawl space access on the plans via openings in the floor or through the foundation walls. Openings shall be 18"x24" minimum through floors, and 16"x24" minimum through walls. If below grade a 16"x24" minimum area-way is required.' },
      { index: 5, subject: 'SRC R311.7', page: 'Sheet A5', text: 'SRC R311.7 - Provide notes or details that clearly show the following basic stair dimensions for each stair run in the plans:\na) Width (Min. 36")\nb) Riser height (Max. 7-3/4")\nc) Tread length (Min. 10")\nd) Clear headroom (Min. 6\'-8")\ne) Landing length (Min. 3\'-0")\nf) Total vertical rise (Max 12\'-7\'\')' },
      { index: 6, subject: 'SRC R308.4', page: 'Sheet A6', text: 'SRC R308.4 - Clearly indicate on the plans each location where safety glazing is required. See the following locations of concern:\na) SRC R308.4.2 - The window in the plane of the door within 24 inches of the door jamb.' },
      { index: 7, subject: 'Roof Assembly', page: 'Sheet A7', text: 'Specify if the roof assembly is vented or unvented, and provide one of the following:\n1) SRC R806.2 - If vented, provide venting details and calculations demonstrating adequate ventilation area, OR\n2) SRC R806.5 - If unvented using spray foam insulation, provide:\n  a) A detail of the proposed assembly showing compliance with one of the 4 assembly options from R806.5, Item 5. Include the R-value of the foam insulation.\n  b) Note: "The applied spray foam must be installed in accordance with the manufacturer\'s instructions by a certified installer."' },
    ]
  },
  'Structural': {
    title: '7088950-CN Structural Cycle 1',
    reviewer: 'David Aguilera',
    email: 'david.aguilera@seattle.gov',
    phone: '206-684-7715',
    date: '2-20-2026',
    pdf: 'Corrections - STRUCTURAL - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: '00 Code Edition', page: 'General', text: 'This project has been reviewed for conformance with: 2021 Seattle Building Code (SBC); 2021 Seattle Residential Code', noAction: true },
      { index: 2, subject: 'Special Inspections', page: 'General', text: 'SBC 1704.2 - Complete and return the SDCI Statement of Structural Special Inspections (uploaded under the latest "Special Inspection notification.pdf" in the permit record), signed by the owner or engineer or architect acting as the owner\'s agent. The designated special inspection agency shall be WABO registered. Note: SDCI will not accept the signature of the contractor on the statement.' },
      { index: 3, subject: 'Foundations & Retaining Walls', page: 'Sheet S2.1', text: 'ASCE 7-16, Section 12.13.9.2.1.1 – On sites with liquefiable soil, isolated spread footings are required to be interconnected with foundation ties. Add ties as required.' },
      { index: 4, subject: 'Lateral Design', page: 'Detail 16/S3.4', text: 'Where the gypsum board ceiling is intended to function as a diaphragm to brace exterior walls for out-of-plane loads, provide structural calculations demonstrating that the gypsum board diaphragm is adequately designed to resist the applied loads. Clearly specify the gypsum board diaphragm construction requirements on the drawings, including panel orientation, required blocking, fastening schedule, and the connection/attachment of the ceiling diaphragm to the exterior walls.' },
    ]
  },
  'Energy': {
    title: '7088950-CN Energy Cycle 1',
    reviewer: 'Cary Novotney',
    email: '',
    phone: '',
    date: '3-6-2026',
    pdf: 'Corrections - ENERGY - 7088950-CN - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'Cooking Range CFM', page: 'General', text: 'Identify the cooking range type and indicate 160 CFM for an electric range and 250 CFM if the range is gas per Table M1505.4.4.3.' },
      { index: 2, subject: 'Ventilation Quality Adjustment', page: 'General', text: 'M1505.4.3.1 Ventilation quality adjustment. The minimum whole house ventilation rate from Section 1505.4.3 shall be adjusted by the system coefficient in Table M1505.4.3(2) based on the system type not meeting the definition of a balanced whole house ventilation system and/or not meeting the definition of a distributed whole house ventilation system. Show the calculation on the drawings. (Typical) Revise and resubmit.' },
      { index: 3, subject: 'Whole House Ventilation Fan', page: 'General', text: 'SRC M1505.4: It appears that the whole house ventilation is provided by the local exhaust fan(s). Identify the fan on the drawing. Also, specify Fan CFM and mode of operation as continuous or intermittent. For intermittent operation specify run time. Balanced or Not balanced.' },
      { index: 4, subject: 'Ventilation Operation Mode', page: 'General', text: 'SRC M1505.4.3: Indicate on the drawings whether the whole house ventilation system will operate continuously or intermittently. If the system is to operate continuously, indicate the minimum ventilation CFM flow rate to be provided, per SRC Table M1505.4.3 (1). If the system is to operate intermittently, provide run-time percentage in each 4-hour segment and corresponding ventilation CFM per SRC Table M1505.4.3.2 on the drawings.' },
      { index: 5, subject: 'Fenestration U-value', page: 'General', text: 'Add the U-value for the fenestration in-line with the compliance path chosen (Typical)' },
      { index: 6, subject: 'Slab Insulation', page: 'General', text: 'Revise the slab on grade insulation to extend a minimum of 4\'-0" with a R-5 thermal break at the wall. (Typical)' },
      { index: 7, subject: 'Heat Recovery Ventilation Detail', page: 'General', text: 'Whole House Ventilation using Heat Recovery system requires a full detail shown on the drawing for the review and inspection verification purpose. An example of such details is available online at http://www.seattle.gov/sdci/codes/codes-we-enforce-(a-z)/mechanical-code' },
    ]
  },
  'Zoning': {
    title: '7088950-CN Zoning Cycle 1',
    reviewer: 'Mike Peli',
    email: '',
    phone: '',
    date: '3-3-2026',
    pdf: 'Corrections - ZONING - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'Permit Number', page: 'General', text: 'Miscellaneous: Please update with construction permit number.' },
      { index: 2, subject: 'Floor Area Ratio', page: 'General', text: 'SMC 23.44.011 (Floor Area Ratio): Per Table A for 23.44.011, the FAR allowed is 0.6. Please update calculation to this FAR.' },
      { index: 3, subject: 'Lot Coverage - Shoreline', page: 'General', text: '23.60A.574 Lot Coverage in UR Environment: Per 23.60A.574.B.1, the lot coverage for the shoreline environment standards is based on dry land portion. Please provide a separate lot coverage calculation based on the shoreline standards of Table A for 23.60A.574.' },
      { index: 4, subject: 'Tree Requirements - General', page: 'General', text: 'SMC 23.44.020 (Tree Requirements): General Compliance: Demonstrate compliance with the tree requirements under SMC 23.44.020.A. This should include identifying the locations of trees meeting the standard, including the species and size proposed/retained, a calculation indicating the proposed and required caliper inches, and a table of which trees satisfy the standard.' },
      { index: 5, subject: 'Tree Requirements - Street Trees', page: 'Site Plan', text: 'SMC 23.44.020 (Tree Requirements): Street Trees: On the site plan sheet, show the location, size, and type of proposed street trees in accordance with SMC 23.44.020.C.1.\n\nObtain conceptual approval from SDOT for the proposed type, number, and location of trees and provide proof of approval (e.g., stamped plans and/or emails) with your correction response.\n\nhttps://seattlegov.zendesk.com/hc/en-us/articles/360048504614' },
      { index: 6, subject: 'Shoreline Setbacks', page: 'General', text: '23.60A.167 Standards for Shoreline Setbacks / 23.60A.206 Standards for Residences: It appears that this site has a code interpretation being reviewed on the determined setback, based on the string line measurements from the neighboring properties. Based on current design it looks like the proposed eastern facade of the structure is farther waterward than the neighboring house. This is pending land use interpretation results.' },
    ]
  },
  'Land Use / Shoreline': {
    title: '7088950-CN Shoreline Cycle 1',
    reviewer: 'David Landry, AICP',
    email: 'david.landry@seattle.gov',
    phone: '206-684-5318',
    date: '2-23-2026',
    pdf: 'Corrections - SHORELINE - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'Shoreline Environment Depiction', page: 'Site Plans', text: 'Construction drawings for Shoreline projects must accurately depict the Shoreline Environment, including boundaries and relevant shoreline features, to comply with Seattle\'s Shoreline Master Program (SMP). The Shoreline District for this property is Urban Residential and Conservancy Recreation.' },
      { index: 2, subject: 'Shoreline BMPs', page: 'Site Plans', text: 'Please depict on the relevant site plans any and all Shoreline best management practices (BMPs) related to construction zones and construction staging areas to prevent deleterious and waste material from entering shoreline habitat during the proposed work, per applicable standards in SMC 23.60A.15.' },
      { index: 3, subject: 'Construction Staging Area', page: 'Site Plans', text: 'Please depict on appropriate site plans the location of any construction staging area and how it will be fitted with BMPs.' },
      { index: 4, subject: 'Equipment Leakage Check', page: 'Plans', text: 'Please specify on plans, equipment using oil, gasoline, or diesel on site shall be checked daily for evidence of leakage, if evidence of leakage is found, further use of such equipment shall be suspended until the deficiency has been satisfactorily corrected.' },
      { index: 5, subject: 'BMP & Emergency Containment Note', page: 'Plans', text: 'Please add a note on the plans that states, the owner(s), builder(s), or responsible party(s) shall follow a Best Management Practices and an Emergency Containment plan developed to prevent debris and other deleterious material from entering the water during construction.' },
      { index: 6, subject: 'Impervious Surface Calculation', page: 'Site Plans', text: 'Please provide calculation for existing and proposed impervious (including but not limited to the two paths and steps leading into the water in the shoreline setback) surface and show any changes to vegetation proposed, including changes that have occurred without prior authorization such as tree removal.\n\nPlease note that an increase in impervious surface will trigger need for mitigation plan per SMC 23.60A.190, which typically is addressed by planting equal area of native vegetation as new impervious surface.\n\nNote: Any new ground coverage—such as a structure, addition, or impermeable surface that intrudes into a shoreline environment is considered an impact. Mitigation must compensate for the removal or disturbance of natural vegetation. Shoreline policies require that every development achieves No Net Loss (NNL) of ecological functions.' },
    ]
  },
  'ECA / Geotech': {
    title: '7088950-CN ECA Geotech Cycle 1',
    reviewer: 'Jackie Bronner',
    email: 'jackie.bronner@seattle.gov',
    phone: '206-233-3952',
    date: '3-3-2026',
    pdf: 'Corrections - GEO - 7088950-CN - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'MSE Wall', page: 'General', text: 'SMC 22.170.110 A.1. Geotechnical report references potential MSE wall for driveway expansion. Clarify if this will be included in current scope. Include on plan set and provide calculations.' },
      { index: 2, subject: 'Landslide-Prone Complete Stabilization', page: 'General', text: 'SMC 25.09.080. Development standards for landslide-prone hazard areas state "Complete stabilization of all portions of a site which are disturbed or affected by the proposed development, including all developmental coverage and construction activity areas shall be required." All areas that are disturbed or developed are required to be completely stabilized. Decks or structural overhangs that project out over the steep slope critical area must not concentrate rainfall directly on to the slope or contribute to slope instability. Provide additional recommendations from the geotechnical engineer to achieve the requirement for complete stabilization, and incorporate those recommendations into the plans.' },
      { index: 3, subject: 'Subsurface Drainage', page: 'Plans', text: 'Include details for subsurface drainage system consistent with recommendations from geotechnical engineer.' },
      { index: 4, subject: 'Temporary Excavation Plan', page: 'Plans', text: 'SMC 22.170.200 B. Provide temporary excavation plan in accordance with recommendations from geotechnical report. At a minimum include lateral extents of excavations in relation to property line, top of excavation elevation, bottom of excavation elevation and maximum cut slopes.\n\nAs drawn on architectural elevation views, cut slopes are steeper than 1H:1V. Please note loose to medium dense soils shown in geotechnical borings.' },
      { index: 5, subject: 'Seismic Site Class F', page: 'General', text: 'SBC 1613.3.3. Where liquefiable soils are present, the site class must be listed as Site Class F.' },
      { index: 6, subject: 'Pin Pile Installation & Testing', page: 'Plans', text: 'SMC 22.170.110A. Provide notes on the plans for installation and field testing requirements for the pin piles. The notes should include (1) the statement that testing shall be in accordance with ASTM Standard D 1143-81 and (2) Minimum pile embedment length consistent with recommendations made in geotechnical report.' },
      { index: 7, subject: 'Liquefaction Down Drag', page: 'General', text: 'SMC 25.09.100. Clarify how down drag was considered on allowable pin pile capacity.' },
      { index: 8, subject: 'Liquefaction Settlement Evaluation', page: 'General', text: 'SMC 25.09.100. Provide a geotechnical addendum with an evaluation of the liquefaction hazards, including the effects of differential settlement and lateral spreading. Provide justification for values used in lateral spreading analysis, specifically for the average fines content. Value used appears to be 76% but borings show material identified as sand.' },
      { index: 9, subject: 'Grading Season Restriction Notes', page: 'TESC Plan', text: 'Please add the following notes to the Temporary Erosion/Sedimentation Control Plan. These notes and requirements are in lieu of establishing a formalized seasonal grading restriction on the project and constitute the customary requirements that would be instituted for a seasonal grading extension:\n\nA site visit from the Geotechnical Special Inspector shall occur during each day of active grading and in the event of significant rainfall which might compromise stabilization measures between November 1 and March 31. The determination of what constitutes significant rainfall is subject to the discretion of the Geotechnical Special Inspector. However, as a minimum standard, the Geotechnical Special Inspector is required to conduct a site visit if more than one-half inch of precipitation occurs on any given day.\n\nAny recommendations required to maintain stability of excavations and proper functioning of the sediment/erosion control system shall be implemented immediately. Field reports must be provided to SDCI within 48 hours of each inspection (sdcigeo@seattle.gov).' },
      { index: 10, subject: 'Liquefaction-Prone Area Covenant', page: 'General', text: 'SMC 22.170.080 C. We require a recorded Liquefaction-Prone Area Covenant prior to issuance of this permit application.\n\nUpload a draft of the unsigned and unrecorded covenant for the reviewer to check. Include information on which signature page you intend to use, the name(s) of the people who will sign, and their relationship to the property.\n\nDo not record the document until after the SDCI reviewer has checked your draft.' },
      { index: 11, subject: 'Plan Review & Minimal Risk Letter', page: 'General', text: 'SMC 22.170.190 A. Provide a signed and stamped letter from the geotechnical engineer that includes review of the plans and provides a minimal risk statement in accordance with Director\'s Rule 5-2016. The plan review/minimal risk letter must be based upon review of plans with all substantial geotechnical recommendations incorporated.' },
      { index: 12, subject: 'Landslide-Prone Area Covenant', page: 'General', text: 'SMC 22.170.080 C. We require a recorded Landslide-Prone Area Covenant prior to issuance of this permit application.\n\nUpload a draft of the unsigned and unrecorded covenant for the reviewer to check. Include information on which signature page you intend to use, the name(s) of the people who will sign, and their relationship to the property.\n\nDo not record the document until after the SDCI reviewer has checked your draft.' },
      { index: 13, subject: 'Potential Slide Area Note', page: 'Plans', text: 'SMC 25.09.330 B.1. Provide a note on the plan that the site is designated as a potential slide area due to geologic conditions.' },
      { index: 14, subject: 'Special Inspector Nomination', page: 'General', text: 'SMC 22.170.130. Nominate a geotechnical engineering firm on the enclosed SDCI Geotechnical Special Inspections Schedule form. This form must be signed by the owner or owner\'s representative; the form cannot be signed by the contractor nor the geotechnical engineer.\n\nThe Inspection Agency must be the same engineer/firm that prepared the geotechnical report. If the owner nominates a different firm, the new engineer must review the original report and submit a letter indicating agreement with the evaluation.' },
    ]
  },
  'Revegetation': {
    title: '7088950-CN Revegetation Cycle 1',
    reviewer: 'Leah Carlson',
    email: 'leah.carlson@seattle.gov',
    phone: '206-684-5191',
    date: '2-26-2026',
    pdf: 'Corrections - REVEGETATION - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'Map Potential Slide ECA', page: 'Plans', text: 'Please map the Potential Slide ECA area on plans. Please note that mitigation sequencing is not needed in potential slide ECA. Additionally, please note that revegetation standards do not apply in shoreline areas, which part of this site is located in.' },
      { index: 2, subject: 'SMC 25.09.070 Compliance', page: 'General', text: 'This project was reviewed for consistency with SMC 25.09.070: Standards for Vegetation and Impervious Surface Management. The proposed project activities appear to be located within mapped environmentally critical areas (ECAs) or their buffers. If either temporary construction disturbance or permanent new development within ECAs or their buffers that impacts trees/vegetation within the ECA is approved, mitigation and revegetation requirements apply even if an exemption or other ECA relief is granted.' },
      { index: 3, subject: 'Existing Conditions Plan', page: 'Plans', text: 'Provide an existing conditions plan, including:\n\na) Delineate and label the ECA.\nb) A brief description/identification of the existing ground coverage within the area of temporary and permanent disturbance in the ECA (lawn, ornamental landscaping, invasive species, tree species, patio, pathway, driveway, stairway, etc.).\nc) Locations of all existing trees within and adjacent to the disturbance area. Include the tree genus, species, and dripline diameter. Number trees consistently across all plan sheets.\nd) A summary narrative of the existing ecological functions performed by the trees and vegetation within the ECA (habitat, soil stabilization, stormwater filtering, detention, and infiltration).' },
      { index: 4, subject: 'Mitigation Sequencing', page: 'General', text: 'Provide documentation of mitigation sequencing. The ECA code requires that you avoid or minimize tree/vegetation removal within ECAs (see SMC 25.09.065). Mitigation sequencing must be undertaken in the order of priority listed in SMC 25.09.065.B. Provide a brief narrative or bulleted list documenting how mitigation sequencing was considered in project design and construction.' },
      { index: 5, subject: 'Area of Impact Calculation', page: 'Plans', text: 'Delineate and label the total area and square feet of both permanent development (structures and hard surface area) and temporary construction disturbance within the ECA. Show all trees proposed to be removed and the following calculation [(a+b) – c = d]:\n\na) Total new development (structures and hard surface area)\nb) Total temporary construction disturbance area\nc) Areas of existing development\nd) Total area of impact that requires mitigation in the form of replanting' },
      { index: 6, subject: 'Mitigation (Revegetation) Plan', page: 'Plans', text: 'Provide a mitigation (revegetation/restoration) plan, including:\n\na) Location and square feet of the mitigation area\nb) Location, size, species, quantities, and spacing of trees/shrubs to be newly planted\nc) A brief narrative describing how the proposed mitigation plan will compensate for the loss of ecological functions\nd) Required notes regarding Pacific Northwest native species, minimum sizes, mulching requirements, and 5-year monitoring and maintenance requirements' },
    ]
  },
  'Drainage': {
    title: '7088950-CN Drainage Cycle 1',
    reviewer: 'Viktor Peykov',
    email: 'viktor.peykov@seattle.gov',
    phone: '206-615-0749',
    date: '2-27-2026',
    pdf: 'Corrections - DRAINAGE - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'OSM Calculator Incomplete', page: 'General', text: 'OSM Calculator Summary Sheet is incomplete. Add the following:\n- SDCI permit number\n- Total new plus replaced landscaping - to match the SA area shown on the CSC plan\n- Total existing hard surface area' },
      { index: 2, subject: 'SPU Public Sewer Mainline Buildover', page: 'General', text: 'A build-over agreement may be required with SPU for this project. The SPU Mainline is located onsite. See Tip 507, Build-Over and/or Re-Route Review and Approval Process, for instructions on applying for a build-over review.\n\nhttp://www.seattle.gov/DPD/Publications/CAM/cam507.pdf\n\nPlease submit the Request for Build-over Review application form and required documentation to the SPU Developer Services Office (DSO). If SPU determines that a build-over agreement is not necessary, then submit the correspondence from SPU indicating so with the next SDCI submittal. Otherwise, the build-over agreement must be finalized before this SDCI permit may be approved for Drainage Review.\n\nNote: when required, new easements or relinquishing existing easements requires City Council action prior to building permit approval, and may take up to 18 months.' },
      { index: 3, subject: 'Engineered Plans - Stamped and Signed', page: 'General', text: 'All Civil Drainage Plan sheets & Drainage Report must be stamped & signed by a licensed Civil PE.' },
      { index: 4, subject: 'Side Sewer', page: 'General', text: 'Drainage Review approval is for private property stormwater only. SPU will conduct sanitary side sewer review under a separate permit. Please add a large boxed note to indicate that.' },
    ]
  },
  'SCL (City Light)': {
    title: '7088950-CN SCL Cycle 1',
    reviewer: 'Max Horne / AditiR',
    email: '',
    phone: '',
    date: '2-24-2026',
    pdf: 'Corrections - SCL - 7088950-CN - Richardson - Cycle 1 (NOTES).pdf',
    comments: [
      { index: 1, subject: 'General Note - ESR Contact', page: 'General', text: 'Be advised that the service connection for the project may be delayed or not possible if all applicable Seattle City Light requirements have not been met.\n\nFor City Light questions and coordination of work, please contact your Electrical Service Representative well in advance. Your ESR is Shayna Sproles, 206-867-1174, shayna.sproles@seattle.gov' },
      { index: 2, subject: 'City Light Easement', page: 'General', text: 'SCL records indicate an existing easement over/near the West property line. Please confirm with SCL_RealEstateServices@seattle.gov or contact Chad Morrell, chad.morrell@seattle.gov and show the correct location of our easement and existing service.\n\nPlease note that construction of any permanent structure within a Seattle City Light (SCL) power easement is not allowed without SCL\'s prior written consent.' },
    ]
  },
  'Fire': {
    title: '7088950-CN Fire Cycle 1',
    reviewer: 'QSteffy',
    email: '',
    phone: '',
    date: '3-12-2026',
    pdf: 'Corrections - FIRE - Richardson - Cycle 1.pdf',
    comments: [
      { index: 1, subject: 'Access / Sprinkler Requirement', page: 'General', text: 'Revise the plans to show either a) installation of a NFPA 13D sprinkler system, or b) construction of a fire apparatus access road in accordance with 2021 Seattle Fire Code section 503.' },
      { index: 2, subject: 'Additional Codes', page: 'General', text: 'ADDITIONAL CODES TO INCLUDE 2021 SEATTLE FIRE CODE & NFPA 13D', noAction: true },
      { index: 3, subject: 'Sprinklers Required', page: 'General', text: 'Revise the plans to show installation of a NFPA 13D sprinkler system as required by 2021 Seattle Fire Code section 903.' },
    ]
  },
};
