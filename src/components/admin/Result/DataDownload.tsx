"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { UserData } from "../../Interfaces/index";

interface Answer {
  _id?: string;
  questionId: {
    question?: string;
    answer?: string;
    multipleAnswer?: string[];
  } | string;
  answer: string | string[];
}

interface DataDownloadProps {
  data: Answer[];
  filename?: string;
  title?: string;
  user: UserData;
  marks: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: '#1e40af',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  gridItem: {
    width: '33.33%',
    padding: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'medium',
  },
  addressBox: {
    width: '50%',
    padding: 5,
  },
  resultSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e293b',
  },
  answerBox: {
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  correctText: {
    color: '#059669',
    marginTop: 3,
  }
});

export default function DataDownload({
  data,
  filename = "contest-results",
  title = "Comprehensive Performance Report",
  user,
  marks,
}: DataDownloadProps) {
  const [format, setFormat] = useState<string>("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  console.log("DataDownload component rendered with data:", data);


  const formatAddress = (addr: any) => {
    if (!addr) return "N/A";
    const parts = [
      addr.streetLine1,
      addr.streetLine2,
      addr.city,
      addr.state,
      addr.zip,
      addr.country
    ].filter(Boolean);
    return parts.join(", ") || "N/A";
  };

  const ContestResultsPDF = () => (
    <Document>
      <Page style={styles.page} size="A4">
        <Text style={styles.header}>{`${title}`}</Text>

        {/* Personal Details */}
        <Text style={styles.sectionTitle}>I. Student Profile</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{`${user.name || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.value}>{`${user.studentId || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{`${user.email || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{`${user.phone || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{`${user.gender || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{`${user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}`}</Text>
          </View>
        </View>

        {/* Academic Details */}
        <Text style={styles.sectionTitle}>II. Academic Information</Text>
        <View style={styles.grid}>
          <View style={[styles.gridItem, { width: '100%' }]}>
            <Text style={styles.label}>College Name</Text>
            <Text style={styles.value}>{`${user.college || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Course</Text>
            <Text style={styles.value}>{`${user.course || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Branch</Text>
            <Text style={styles.value}>{`${user.branch || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Current Semester</Text>
            <Text style={styles.value}>{`${user.currentSemester || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>CGPA / Percentage</Text>
            <Text style={styles.value}>{`${user.cgpa || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Passing Year</Text>
            <Text style={styles.value}>{`${user.passingYear || "N/A"}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Active Backlogs</Text>
            <Text style={styles.value}>{`${user.backlog || "0"}`}</Text>
          </View>
        </View>

        {/* Addresses */}
        <Text style={styles.sectionTitle}>III. Communication Details</Text>
        <View style={styles.grid}>
          <View style={styles.addressBox}>
            <Text style={styles.label}>Current Address</Text>
            <Text style={styles.value}>{`${formatAddress(user.currAddress)}`}</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.label}>Permanent Address</Text>
            <Text style={styles.value}>{`${formatAddress(user.permAddress)}`}</Text>
          </View>
        </View>

        {/* Contest Performance */}
        <Text style={styles.sectionTitle}>IV. Contest Performance</Text>
        <View style={[styles.grid, { backgroundColor: '#eff6ff', padding: 10, borderRadius: 5, marginBottom: 15 }]}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Total Score</Text>
            <Text style={[styles.value, { color: '#1d4ed8', fontSize: 14, fontWeight: 'bold' }]}>{`${marks}`}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Completion Status</Text>
            <Text style={[styles.value, { color: '#059669', fontSize: 10 }]}>SUCCESSFUL</Text>
          </View>
        </View>

        <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 10, color: '#4d5562' }}>Detailed Responses:</Text>

        {data.map((result, index) => (
          <View key={result._id || index} style={styles.resultSection}>
            <Text style={styles.questionText}>{`Q${index + 1}. ${typeof result.questionId === "object" ? (result.questionId as any).question : "N/A"}`}</Text>
            <View style={styles.answerBox}>
              <Text style={{ fontSize: 9, color: '#64748b' }}>Submitted Answer:</Text>
              <Text style={styles.value}>{`${Array.isArray(result.answer) ? result.answer.join(", ") : (result.answer || "No response")}`}</Text>

              <Text style={[styles.correctText, { fontSize: 9 }]}>Correct Answer: {`${typeof result.questionId === "object"
                ? ((result.questionId as any).answer || (result.questionId as any).multipleAnswer?.join(", ") || "N/A")
                : "N/A"
                }`}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );

  // Trigger PDF download using Blob and pdf() utility from @react-pdf/renderer
  // but @react-pdf/renderer does not provide a direct client blob generator easily,
  // so we create a temporary hidden PDFDownloadLink and click it programmatically.

  const downloadPDF = () => {
    setIsDownloading(true);
    // Create a hidden link with PDFDownloadLink and programmatically click it

    // Render a PDFDownloadLink and trigger click — hacky but works client side:

    const linkId = "pdf-download-link";

    const timeoutId = setTimeout(() => {
      setIsDownloading(false);
      // cleanup link element if any
      const el = document.getElementById(linkId);
      if (el) el.remove();
    }, 5000);

    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    import("@react-pdf/renderer").then(({ pdf }) => {
      pdf(<ContestResultsPDF />)
        .toBlob()
        .then((blob) => {
          if (!blob) {
            alert("Failed to generate PDF");
            setIsDownloading(false);
            clearTimeout(timeoutId);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${filename}.pdf`;
          a.id = linkId;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          setIsDownloading(false);
          clearTimeout(timeoutId);
        });
    });
  };

  const handleDownload = async () => {
    if (data.length === 0) return;
    switch (format) {
      case "pdf":
        downloadPDF();
        break;
      default:
        downloadPDF();
    }
  };

  const getFormatIcon = () => {
    switch (format) {
      case "csv":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "json":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 7v10c0 2.21 3.79 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.79 4 8 4s8-1.79 8-4M4 7c0-2.21 3.79-4 8-4s8 1.79 8 4"
            />
          </svg>
        );
      case "excel":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "pdf":
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 20h9M12 4h9M4 9h16M4 15h16M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
        <span className="mr-2">{getFormatIcon()}</span>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="cursor-pointer rounded border-none bg-transparent p-0 text-sm focus:outline-none"
          aria-label="Select download format"
        >
          <option value="pdf">PDF</option>
        </select>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="ml-4 rounded bg-blue-600 px-3 py-1 text-black hover:bg-blue-700 disabled:bg-gray-400"
          aria-label="Download data"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}
