import { FormField } from "@/types/form";

export interface StudentFormProps {
  fields: FormField[];
  onSubmit: (formData: any) => Promise<void>;
  submitButtonText: string;
}

const StudentForm = ({ fields, onSubmit, submitButtonText }: StudentFormProps) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: any = {};
    fields.forEach(field => {
      const input = event.currentTarget.elements[field.name] as HTMLInputElement;
      formData[field.name] = input.value;
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field.id} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "text" && (
            <input
              type="text"
              name={field.name}
              required={field.required}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          )}
          {field.type === "date" && (
            <input
              type="date"
              name={field.name}
              required={field.required}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          )}
          {field.type === "select" && field.options && (
            <select
              name={field.name}
              required={field.required}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
              {field.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        {submitButtonText}
      </button>
    </form>
  );
};

export default StudentForm;
