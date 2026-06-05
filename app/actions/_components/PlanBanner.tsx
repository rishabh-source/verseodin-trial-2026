export function PlanBanner() {
  return (
    <div className="w-full bg-indigo-50/50 border-b border-indigo-100 py-2.5 px-6 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
      <div className="text-indigo-900 font-medium text-center sm:text-left">
        You&apos;re on the Explore plan — tracking 10 prompts with ChatGPT only
      </div>
      <button 
        type="button" 
        onClick={() => alert("Pricing plans coming soon! (Not implemented in this trial)")}
        className="text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap focus:outline-none focus:underline"
      >
        See plans
      </button>
    </div>
  );
}
