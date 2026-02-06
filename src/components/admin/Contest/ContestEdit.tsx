import { useForm } from "react-hook-form";

interface EditContestFormProps {
  defaultValues: {
    title: string;
    description: string;
    date: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const EditContestForm: React.FC<EditContestFormProps> = ({
  defaultValues,
  onSave,
  onCancel,
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="p-4 bg-gray-100 rounded-2xl shadow-lg space-y-3"
    >
      <input
        {...register("title", { required: true })}
        placeholder="Contest Title"
        className="border p-2 rounded w-full"
      />

      <textarea
        {...register("description", { required: true })}
        placeholder="Contest Description"
        className="border p-2 rounded w-full"
      />

      <input
        type="date"
        {...register("date", { required: true })}
        className="border p-2 rounded w-full"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-black px-3 py-1 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-black px-3 py-1 rounded-lg hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditContestForm;
