"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface Answer {
  question: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  // ... add other properties if present
}

interface User {
  _id: string;
  name: string;
  email?: string;
  profilePic?: string;
  phone?: string;
  altPhone?: string;
}

interface ContestResult {
  _id: string;
  contestId: string;
  userId: User;
  declared: boolean;
  answers: Answer[];
  totalMarks?: number;
  timeTaken?: number;
  sumbittedOn: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface DataDownloadProps {
  data: ContestResult[];
  filename?: string;
  title?: string;
  username?: string;
  marks?: number;
  college?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  section: {
    marginBottom: 12,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },
  questionText: {
    marginBottom: 2,
  },
  answerCorrect: {
    color: "green",
  },
  answerIncorrect: {
    color: "red",
  },
  smallText: {
    fontSize: 10,
    color: "#666",
  },
});

export default function DataDownload({
  data,
  filename = "contest-results",
  title = "WBT Contest Results",
  username,
  marks,
  college = "N/A",
}: DataDownloadProps) {
  const [format, setFormat] = useState<string>("csv");
  const [isDownloading, setIsDownloading] = useState(false);
  console.log("DataDownload component rendered with data:", data);
  //   const formatTime = (ms: number) => {
  //     const totalSeconds = Math.floor(ms / 1000);
  //     const hours = Math.floor(totalSeconds / 3600);
  //     const minutes = Math.floor((totalSeconds % 3600) / 60);
  //     const seconds = totalSeconds % 60;
  //     return `${hours}h ${minutes}m ${seconds}s`;
  //   };

  //   const flattenData = (data: ContestResult[]) => {
  //     console.log("Flattening data for download", data);
  //     return data.map((item) => ({
  //       id: item._id,
  //       contestId: item.contestId,
  //       userName: item.userId?.name || "N/A",
  //       userEmail: item.userId?.email || "N/A",
  //       userId: item.userId?._id || "N/A",
  //       declared: item.declared,
  //       answer: item.answer || "N/A",
  //       questionId: item.questionId || "N/A",
  //       totalMarks: item.totalMarks || 0,
  //       timeTaken: item.timeTaken ? formatTime(item.timeTaken) : "N/A",
  //       submittedOn: new Date(item.sumbittedOn).toLocaleString(),
  //       answersCount: item.answers?.length || 0,
  //       profilePic: item.userId?.profilePic || "N/A",
  //     }));
  //   };

  // Download CSV, JSON, Excel remain unchanged...

  //   const downloadCSV = () => {
  //     const flatData = flattenData(data);
  //     const headers = Object.keys(flatData[0] || {});
  //     const csvContent = [
  //       headers.join(","),
  //       ...flatData.map((row) =>
  //         headers
  //           .map((header) => {
  //             const value = row[header as keyof typeof row];
  //             return typeof value === "string" && value.includes(",")
  //               ? `"${value}"`
  //               : value;
  //           })
  //           .join(",")
  //       ),
  //     ].join("\n");

  //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${filename}.csv`;
  //     link.click();
  //     URL.revokeObjectURL(link.href);
  //   };

  //   const downloadJSON = () => {
  //     const jsonContent = JSON.stringify(data, null, 2);
  //     const blob = new Blob([jsonContent], { type: "application/json" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${filename}.json`;
  //     link.click();
  //     URL.revokeObjectURL(link.href);
  //   };

  //   const downloadExcel = () => {
  //     const flatData = flattenData(data);
  //     const headers = Object.keys(flatData[0] || {});

  //     const htmlTable = `
  //       <table>
  //         <thead>
  //           <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
  //         </thead>
  //         <tbody>
  //           ${flatData
  //             .map(
  //               (row) =>
  //                 `<tr>${headers
  //                   .map((h) => `<td>${row[h as keyof typeof row]}</td>`)
  //                   .join("")}</tr>`
  //             )
  //             .join("")}
  //         </tbody>
  //       </table>
  //     `;

  //     const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel" });
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${filename}.xls`;
  //     link.click();
  //     URL.revokeObjectURL(link.href);
  //   };

  // PDF document component
  const ContestResultsPDF = () => (
    <Document>
      <Page style={styles.page} size="A4">
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.subHeader}>Name- {username}</Text>
        <Text style={styles.subHeader}>Marks- {marks}/100</Text>
        <Text style={styles.subHeader}>College- {college}</Text>
        {data.map((result, index) => (
          <View key={result._id} style={styles.section}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Question: {index + 1}-</Text>{" "}
              {typeof result.questionId === "object" &&
              result.questionId !== null &&
              "question" in result.questionId
                ? (result.questionId as { question?: string }).question || " "
                : " "}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Correct Answer</Text>{" "}
              {typeof result.questionId === "object" &&
              result.questionId !== null &&
              "answer" in result.questionId
                ? (result.questionId as { answer?: string }).answer || " "
                : (typeof result.questionId === "object" &&
                  result.questionId !== null &&
                  "multipleAnswer" in result.questionId)
                ? Array.isArray((result.questionId as { multipleAnswer?: string[] }).multipleAnswer)
                  ? (result.questionId as { multipleAnswer?: string[] }).multipleAnswer?.join(", ") || " "
                  : " "
                : " "}
            </Text>
            <Text style={{ fontWeight: "bold" }}>Answers: </Text>
            <Text>
              {typeof result.answer === "string" ||
              typeof result.answer === "number"
                ? result.answer
                : result.answer
                ? JSON.stringify(result.answer)
                : " "}
            </Text>
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
          className="ml-4 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:bg-gray-400"
          aria-label="Download data"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}
