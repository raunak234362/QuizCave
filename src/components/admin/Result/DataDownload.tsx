"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { UserData } from "../../Interfaces/index";

interface Answer {
  _id?: string;
  questionId:
    | {
        question?: string;
        answer?: string;
        multipleAnswer?: string[];
      }
    | string;
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
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#334155",
  },
  header: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "center",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 2,
    textTransform: "uppercase",
    backgroundColor: "#f1f5f9",
    padding: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "35%",
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
  },
  value: {
    width: "65%",
    fontSize: 9,
    color: "#1e293b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%", // 2 columns
    flexDirection: "row",
    marginBottom: 6,
    paddingRight: 10,
  },
  addressBlock: {
    marginTop: 4,
    marginBottom: 8,
  },
  scoreBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    textAlign: "center",
  },
  questionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0f172a",
  },
  answerRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  answerLabel: {
    fontSize: 8,
    color: "#64748b",
    width: 60,
  },
  answerValue: {
    fontSize: 9,
    flex: 1,
  },
  correctAnswer: {
    color: "#059669",
    fontWeight: "bold",
  },
  userAnswer: {
    color: "#1e293b",
  },
});

export default function DataDownload({
  data,
  filename = "result_report",
  title = "Comprehensive Performance Report",
  user,
  marks,
}: DataDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper to format address
  const formatAddress = (addr: any) => {
    if (!addr) return "N/A";
    const parts = [
      addr.streetLine1,
      addr.streetLine2,
      addr.city,
      addr.state,
      addr.zip,
      addr.country,
    ].filter(Boolean);
    return parts.join(", ") || "N/A";
  };

  const ContestResultsPDF = () => (
    <Document>
      <Page style={styles.page} size="A4">
        <Text style={styles.header}>{title}</Text>

        {/* 1. Personal Details */}
        <Text style={styles.sectionTitle}>I. Personal Details</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{user.name || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Student ID:</Text>
            <Text style={styles.value}>{user.studentId || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phone || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Alt Phone:</Text>
            <Text style={styles.value}>{user.altPhone || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{user.gender || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Father's Name:</Text>
            <Text style={styles.value}>{user.fatherName || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Mother's Name:</Text>
            <Text style={styles.value}>{user.motherName || "N/A"}</Text>
          </View>
        </View>

        {/* 2. Addresses */}
        <Text style={styles.sectionTitle}>II. Communication Details</Text>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.addressBlock}>
            <Text style={[styles.label, { width: "100%", marginBottom: 2 }]}>
              Current Address:
            </Text>
            <Text style={[styles.value, { width: "100%" }]}>
              {formatAddress(user.currAddress)}
            </Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={[styles.label, { width: "100%", marginBottom: 2 }]}>
              Permanent Address:
            </Text>
            <Text style={[styles.value, { width: "100%" }]}>
              {formatAddress(user.permAddress) ===
              formatAddress(user.currAddress)
                ? "Same as Current Address"
                : formatAddress(user.permAddress)}
            </Text>
          </View>
        </View>

        {/* 3. Academic Details */}
        <Text style={styles.sectionTitle}>III. Academic Information</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>College:</Text>
            <Text style={styles.value}>{user.college || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Course:</Text>
            <Text style={styles.value}>{user.course || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Branch:</Text>
            <Text style={styles.value}>{user.branch || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Semester:</Text>
            <Text style={styles.value}>{user.currentSemester || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>CGPA/Percent:</Text>
            <Text style={styles.value}>{user.cgpa || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Passing Year:</Text>
            <Text style={styles.value}>{user.passingYear || "N/A"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Backlogs:</Text>
            <Text style={styles.value}>{user.backlog || "0"}</Text>
          </View>
        </View>

        {/* 4. Score Summary */}
        <View style={styles.scoreBox}>
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "#1e40af" }}>
            Total Score: {marks}
          </Text>
        </View>

        {/* 5. Detailed Answers */}
        <Text style={styles.sectionTitle}>IV. Detailed Responses</Text>
        {data.map((res, idx) => (
          <View key={idx} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              Q{idx + 1}.{" "}
              {typeof res.questionId === "object"
                ? (res.questionId as any).question
                : "Question text unavailable"}
            </Text>

            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Your Answer:</Text>
              <Text style={[styles.answerValue, styles.userAnswer]}>
                {Array.isArray(res.answer)
                  ? res.answer.join(", ")
                  : res.answer || "No Answer"}
              </Text>
            </View>

            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Correct:</Text>
              <Text style={[styles.answerValue, styles.correctAnswer]}>
                {typeof res.questionId === "object"
                  ? (res.questionId as any).answer ||
                    (res.questionId as any).multipleAnswer?.join(", ") ||
                    "N/A"
                  : "N/A"}
              </Text>
            </View>
          </View>
        ))}

        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 8,
            color: "#94a3b8",
          }}
        >
          Generated via QuizCave Report System
        </Text>
      </Page>
    </Document>
  );

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(<ContestResultsPDF />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
          isDownloading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-sm"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {isDownloading ? "Generating PDF..." : "Download PDF Report"}
      </button>
    </div>
  );
}
