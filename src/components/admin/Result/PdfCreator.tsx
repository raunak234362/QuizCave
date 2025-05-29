import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    PDFViewer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        fontSize: 10,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#2c3e50',
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: '#34495e',
    },
    section: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderColor: '#dcdde1',
        borderWidth: 1,
    },
    questHeader: {
        fontSize: 14,
        marginBottom: 8,
        color: '#2980b9',
        fontWeight: 'bold',
    },
    questionText: {
        fontSize: 12,
        marginBottom: 5,
        color: '#2c3e50',
    },
    answerText: {
        fontSize: 12,
        color: '#27ae60',
        marginBottom: 5,
    },
    studentAnswerText: {
        fontSize: 12,
        color: '#c0392b',
        marginBottom: 5,
    },
    img: {
        width: '100%',
        maxWidth: 250,
        marginVertical: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    redText: {
        color: 'red',
    },
});

const mark = {
    easy: 1,
    medium: 3,
    hard: 5,
};

// Interfaces
interface QuestionItem {
    _id?: string;
    answer?: string[];
    questionId: {
        question?: string;
        mcqOptions?: string[];
        multipleQuestion?: string[];
        questionImage?: string;
        answer?: string;
        multipleAnswer?: string[];
        difficult?: 'easy' | 'medium' | 'hard' | string;
    };
}

interface PdfCreatorProps {
    question?: QuestionItem[];
    username?: string;
    marks?: number;
}

const chunkQuestions = (questions: QuestionItem[], chunkSize: number): QuestionItem[][] => {
    const chunks: QuestionItem[][] = [];
    for (let i = 0; i < questions.length; i += chunkSize) {
        chunks.push(questions.slice(i + 0, i + chunkSize));
    }
    return chunks;
};

const PdfCreator: React.FC<PdfCreatorProps> = ({ question = [], username = '', marks = 0 }) => {
    const questionChunks = chunkQuestions(question, 3);

    return (
        <PDFViewer width="1000px" height="900px">
            <Document>
                {questionChunks.map((chunk, pageIndex) => (
                    <Page key={pageIndex} size="A4" style={styles.page}>
                        {pageIndex === 0 && (
                            <>
                                <View style={styles.header}>
                                    <Text>Student: {username}</Text>
                                </View>
                                <View style={styles.subHeader}>
                                    <Text>Marks: {marks}/60</Text>
                                </View>
                            </>
                        )}

                        {chunk.map((item, index) => {
                            const q = item?.questionId;

                            return (
                                <View key={item?._id || index} style={styles.section}>
                                    <View style={styles.questHeader}>
                                        <Text>
                                            Question {pageIndex * 3 + index + 1}{' '}
                                            <Text style={styles.redText}>
                                                {`[${mark[(q?.difficult as 'easy' | 'medium' | 'hard') ?? 'easy'] || 0} Marks]`}
                                            </Text>
                                        </Text>
                                    </View>

                                    {q?.question && <Text style={styles.questionText}>{q.question}</Text>}

                                    {!!q?.mcqOptions?.length && (
                                        <View>
                                            {q.mcqOptions.map((opt, idx) => (
                                                <Text key={idx} style={styles.questionText}>
                                                    MCQ Option {idx + 1}: {opt}
                                                </Text>
                                            ))}
                                        </View>
                                    )}

                                    {!!q?.multipleQuestion?.length && (
                                        <View>
                                            {q.multipleQuestion.map((mq, idx) => (
                                                <Text key={idx} style={styles.questionText}>
                                                    Sub Question {idx + 1}: {mq}
                                                </Text>
                                            ))}
                                        </View>
                                    )}

                                    {q?.questionImage && (
                                        <Image src={`${import.meta.env.VITE_IMG_UR}/${q.questionImage}`} style={styles.img} />
                                    )}

                                    <View>
                                        {q?.answer && (
                                            <Text style={styles.answerText}>Correct Answer: {q.answer}</Text>
                                        )}
                                        {!!q?.multipleAnswer?.length && (
                                            <View>
                                                {q.multipleAnswer.map((ans, idx) => (
                                                    <Text key={idx} style={styles.answerText}>
                                                        Sub Answer {idx + 1}: {ans}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>

                                    <View>
                                        <Text style={styles.bold}>Answer By Student:</Text>
                                        {item?.answer && item.answer.length > 0 ? (
                                            item.answer.map((ans, idx) => (
                                                <Text key={idx} style={styles.studentAnswerText}>
                                                    {`${idx + 1}: ${ans}`}
                                                </Text>
                                            ))
                                        ) : (
                                            <Text style={styles.studentAnswerText}>No answer provided</Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </Page>
                ))}
            </Document>
        </PDFViewer>
    );
};

export default PdfCreator;
