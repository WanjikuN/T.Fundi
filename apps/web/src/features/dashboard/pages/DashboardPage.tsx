const DashboardPage = () => {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Welcome to T.Fundi
        </h1>

        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Your furniture business workspace.
        </p>

        <button className="mt-6 rounded-[var(--radius)] bg-[var(--color-primary)] px-5 py-3 font-medium text-[var(--color-primary-foreground)]">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;