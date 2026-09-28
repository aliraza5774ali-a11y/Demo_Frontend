import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, Lock } from "lucide-react";
import { safepayStartRequest, safepayStatusRequest } from "../api/ordersApi";
import { setLastOrder } from "../features/orders/ordersSlice";
import { formatPrice } from "../utils/price";
import PageHeader from "../components/layout/PageHeader";

// SafePay's webhook usually lands within seconds of the redirect; keep asking
// for a little while before telling the shopper it is still being confirmed.
const POLL_MS = 3000;
const POLL_FOR_MS = 30_000;

// Where SafePay sends the shopper back to — after paying, or after pressing
// cancel (…&cancelled=1). The page never trusts the redirect: it asks the
// server, which checks with SafePay directly.
const SafepayReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderId = params.get("order");
  const token = params.get("token");
  const tracker = params.get("tracker");
  const cancelled = params.get("cancelled") === "1";

  const missing = !orderId || !token;
  // checking → paid (navigates) | unpaid | cancelled | refund_due | error
  const [phase, setPhase] = useState(missing ? "error" : "checking");
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);
  // Bumped to run the check again ("Check again", or after a retry).
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (missing) return undefined;
    let stopped = false;
    let timer;
    const startedAt = Date.now();
    const poll = async () => {
      try {
        const result = await safepayStatusRequest(orderId, token, tracker);
        if (stopped) return;
        if (result.summary) setSummary(result.summary);
        if (result.status === "paid") {
          dispatch(setLastOrder(result.summary));
          navigate("/order-success/" + orderId, { replace: true });
          return;
        }
        if (result.status === "refund_due" || result.status === "cancelled") {
          setPhase(result.status);
          return;
        }
        // Cancelled on SafePay's page: nothing to wait for.
        if (cancelled || Date.now() - startedAt > POLL_FOR_MS) {
          setPhase("unpaid");
          return;
        }
        timer = setTimeout(poll, POLL_MS);
      } catch (error) {
        if (stopped) return;
        setMessage(error.response?.data?.message || "");
        setPhase("error");
      }
    };
    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [missing, orderId, token, tracker, cancelled, attempt, dispatch, navigate]);

  const checkAgain = () => {
    setPhase("checking");
    setAttempt((n) => n + 1);
  };

  const payAgain = async () => {
    setPaying(true);
    setMessage("");
    try {
      const result = await safepayStartRequest(orderId, token);
      if (result?.status === "paid") {
        setPaying(false);
        checkAgain();
        return;
      }
      if (!result?.url) throw new Error();
      window.location.assign(result.url);
    } catch (error) {
      setPaying(false);
      setMessage(error.response?.data?.message || "We couldn't open the payment page. Please try again.");
    }
  };

  const content = {
    checking: {
      title: "Confirming your payment",
      subtitle: "This only takes a moment. Please don't close this page or pay again.",
    },
    unpaid: {
      title: cancelled ? "Payment cancelled" : "Payment not completed yet",
      subtitle: cancelled
        ? `No money was taken. Order #${orderId} is reserved for you for a short while — you can pay now to complete it.`
        : `We haven't received a payment for order #${orderId} yet. If you just paid, it may take a minute to confirm — otherwise you can try again.`,
    },
    cancelled: {
      title: "This order was cancelled",
      subtitle: "It wasn't paid in time, so the items were released. Your bag is ready for a new order.",
    },
    refund_due: {
      title: "Payment received after cancellation",
      subtitle: `We received your payment for order #${orderId} after it had been cancelled. A full refund has been queued and our team will be in touch.`,
    },
    error: {
      title: "We couldn't find that payment",
      subtitle: message || "The payment link is incomplete or has expired.",
    },
  }[phase];

  return (
    <section className="page-section min-h-[70vh] bg-white">
      <div className="page-inner max-w-2xl">
        <PageHeader eyebrow="Payment" title={content.title} subtitle={content.subtitle} />

        {phase === "checking" && (
          <div className="mt-8 flex items-center gap-3 text-sm text-black/60" role="status" aria-live="polite">
            <Loader2 size={18} className="animate-spin" /> Checking with SafePay…
          </div>
        )}

        {summary && phase === "unpaid" && (
          <div className="mt-8 flex justify-between rounded-2xl bg-[#f8f8f8] p-6 text-base font-semibold text-black">
            <span>Order #{summary.id}</span>
            <span className="tabular-nums">{formatPrice(summary.total)}</span>
          </div>
        )}

        {message && phase === "unpaid" && (
          <p role="alert" className="mt-4 rounded-md bg-[#fdf2f4] px-3 py-2.5 text-[13px] text-[#c01a3b]">{message}</p>
        )}

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {phase === "unpaid" && (
            <button
              type="button"
              onClick={payAgain}
              disabled={paying}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-[13px] font-medium text-white transition hover:bg-black/90 disabled:opacity-60"
            >
              {paying ? <Loader2 size={15} className="animate-spin" /> : <Lock size={14} />}
              {paying ? "Opening secure payment…" : summary ? `Pay ${formatPrice(summary.total)}` : "Pay now"}
            </button>
          )}
          {phase === "unpaid" && !cancelled && (
            <button
              type="button"
              onClick={checkAgain}
              className="text-sm text-black/60 underline hover:text-black"
            >
              Check again
            </button>
          )}
          {phase !== "checking" && (
            <Link to="/shops" className="text-sm text-black/60 underline hover:text-black">
              Back to shop
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default SafepayReturn;
