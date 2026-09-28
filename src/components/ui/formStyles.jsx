// Stripe-style form primitives shared by checkout and returns.
export const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif';

const inputBase =
  "block w-full bg-white px-3 py-2.5 text-[15px] text-[#1a1a1a] placeholder:text-[#a3a3a8] outline-none transition " +
  "focus:relative focus:z-10 focus:ring-4 focus:ring-[#c9a96e]/25 focus:border-[#c9a96e] disabled:bg-[#fafafa] disabled:text-[#6b6b73]";
export const inputSingle = inputBase + " rounded-md border border-[#e3e3e6] shadow-[0_1px_1px_rgba(0,0,0,0.03),0_3px_6px_rgba(0,0,0,0.02)]";
// Stacked fields share borders, like Stripe's address element.
export const inputGrouped = inputBase + " -mt-px border border-[#e3e3e6] first:mt-0";
export const cardBox = "rounded-md border border-[#e3e3e6] shadow-[0_1px_1px_rgba(0,0,0,0.03),0_3px_6px_rgba(0,0,0,0.02)]";
export const primaryButton =
  "flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1a1a1a] text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition hover:bg-black disabled:cursor-default disabled:bg-[#3a3a3f]";
export const secondaryButton =
  "flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-[14px] font-medium text-[#1a1a1a] shadow-[0_0_0_1px_#e3e3e6] transition hover:shadow-[0_0_0_1px_#c9c9ce] disabled:opacity-50";

export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-[#4a4a55]">
    {children}
  </label>
);

export const SectionTitle = ({ children }) => <h2 className="mb-3 text-[15px] font-semibold text-[#1a1a1a]">{children}</h2>;

export const ErrorNote = ({ children }) =>
  children ? (
    <p role="alert" className="mt-3 rounded-md bg-[#fdf2f4] px-3 py-2.5 text-[13px] text-[#c01a3b]">
      {children}
    </p>
  ) : null;
