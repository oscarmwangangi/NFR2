// src/controllers/ReportAbuseController.js
import db from '../../config/db.js';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { upload } from '../multer.js';  // Adjust the path as needed
dotenv.config();

// Submit a new abuse report
const submitReport = async (req, res) => {
  try {
    const { email, issueType, description } = req.body;
    let attachmentPath = null;


    if (req.file) {
      // Convert the absolute path to a relative path relative to the current working directory
      attachmentPath = path.relative(process.cwd(), req.file.path);
    }
    // MySQL INSERT query
    const query = `
      INSERT INTO reports (email, issue_type, description, attachment_path, status)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [email, issueType, description, attachmentPath, 'Pending'];

    // Execute the query
    const [result] = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully!',
      data: { id: result.insertId, email, issueType, description },
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report. Please try again later.',
    });
  }
};

// Get all reports (for admin)
const getAllReports = async (req, res) => {
  try {
    const query = 'SELECT * FROM reports ORDER BY created_at DESC;';
    const [reports] = await db.query(query);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports.',
    });
  }
};

// Update report status (for admin)
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE reports
      SET status = ?
      WHERE id = ?;
    `;
    const values = [status, reportId];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated successfully!',
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status.',
    });
  }
};

// Delete a report (for admin)
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Fetch the report to get the attachment path
    const fetchQuery = 'SELECT * FROM reports WHERE id = ?;';
    const [report] = await db.query(fetchQuery, [reportId]);

    if (report.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    // Delete the report from the database
    const deleteQuery = 'DELETE FROM reports WHERE id = ?;';
    await db.query(deleteQuery, [reportId]);

    // Delete the associated attachment if it exists
    if (report[0].attachment_path) {
      fs.unlinkSync(report[0].attachment_path);
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report.',
    });
  }
};

export default { upload, submitReport, getAllReports, updateReportStatus, deleteReport };
