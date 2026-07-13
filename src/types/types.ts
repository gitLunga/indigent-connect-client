// types.js
/**
 * @typedef {Object} UserData
 * @property {string} [title]
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} [phone_number]
 * @property {string} [region]
 * @property {string} id_number
 * @property {string} [department_id]
 * @property {string} password
 */

/**
 * @typedef {Object} Applicant
 * @property {number} applicant_id
 * @property {string} [title]
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} [phone_number]
 * @property {string} [region]
 * @property {string} id_number
 * @property {string} [department_id]
 * @property {'Pending'|'Profile_Completed'|'Verified'|'Rejected'|'Deactivated'} registration_status
 * @property {string} [verification_notes]
 * @property {string} created_at
 */

/**
 * @typedef {Object} OperationalUser
 * @property {number} [op_user_id]
 * @property {string} [title]
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {'Admin'|'Intake_Clerk'|'Assessment_Officer'|'Supervisor'} user_role
 * @property {string} password
 * @property {string} created_at
 */

/**
 * @typedef {Object} FileData
 * @property {string} uri
 * @property {string} name
 * @property {string} type
 * @property {number} [size]
 */

/**
 * @typedef {Object} CompleteProfileData
 * @property {FileData} id_document
 * @property {FileData} income_document
 * @property {FileData} [residence_document]
 * @property {FileData} [affidavit_document]
 */

/**
 * @typedef {Object} LoginData
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} Application
 * @property {number} application_id
 * @property {number} applicant_id
 * @property {'Pending'|'Pending_Assessment'|'Approved'|'Rejected'|'Cancelled'} application_status
 * @property {string} submission_date
 * @property {string} last_updated
 * @property {string} [rejection_reason]
 * @property {number} [parent_application_id]
 */

/**
 * @typedef {Object} ApplicationSummary
 * @property {number} total_applications
 * @property {number} pending
 * @property {number} approved
 * @property {number} rejected
 * @property {number} cancelled
 */

/**
 * @typedef {Object} Notification
 * @property {number} notification_id
 * @property {number} user_id
 * @property {'Applicant'|'Operational'} user_type
 * @property {string} title
 * @property {string} message
 * @property {boolean} is_read
 * @property {string} created_at
 */
