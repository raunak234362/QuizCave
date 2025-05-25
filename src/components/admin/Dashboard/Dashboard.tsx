type CardProps = {
  title: string;
  content: string;
};

const Card = ({ title, content }: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

const data = [
  {
    title: "Card 1",
    content: "This is the content of card 1.",
  },
  {
    title: "Card 1",
    content: "This is the content of card 1.",
  },
  {
    title: "Card 1",
    content: "This is the content of card 1.",
  },
];

const Dashboard = () => {
  return (
    <div className="h-[89vh] space-y-4 p-4 ">
      <div className=" justify-between flex gap-5">
        {data.map((item, index) => (
          <div>
            <Card key={index} title={item.title} content={item.content} />
          </div>
        ))}
      </div>
      <div className="bg-green-500">TAble Data</div>
    </div>
  );
};

export default Dashboard;
