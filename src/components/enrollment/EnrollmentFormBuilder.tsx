import { useState } from "react";
import { toast } from "sonner";

const EnrollmentFormBuilder = ({ showHeader = true }) => {
  const [formFields, setFormFields] = useState([]);

  const addField = () => {
    setFormFields([...formFields, { id: Date.now(), label: "", type: "text" }]);
    toast.success("Campo adicionado!");
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
    toast.success("Campo removido!");
  };

  const handleFieldChange = (id, value) => {
    setFormFields(formFields.map(field => (field.id === id ? { ...field, label: value } : field)));
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Construtor de Formulário</h2>
          <p>Adicione, remova e configure os campos do formulário de inscrição.</p>
        </div>
      )}
      <div className="space-y-4">
        {formFields.map(field => (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder="Nome do Campo"
              className="border p-2 rounded"
            />
            <button onClick={() => removeField(field.id)} className="bg-red-500 text-white p-2 rounded">
              Remover
            </button>
          </div>
        ))}
        <button onClick={addField} className="bg-blue-500 text-white p-2 rounded">
          Adicionar Campo
        </button>
      </div>
    </div>
  );
};

export { EnrollmentFormBuilder };
