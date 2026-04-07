
import TransactionForm from "@/components/TransactionForm/TransactionForm";

export default function FormPage({
  params,
}: {
  params: { type: string };
}) {
  return (
    <>
      <div style={{ color: "white", padding: "20px" }}>
        TYPE: {params.type}
      </div>
      <TransactionForm mode="create" initialType={params.type as "income" | "expense"} />
    </>
  );
}