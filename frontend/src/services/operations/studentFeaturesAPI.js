import { toast } from "react-hot-toast"
import { studentEndpoints } from "../apis"
import { apiConnector } from "../apiConnector"
import rzpLogo from "../../assets/Logo/ChatGPT Image Apr 5, 2025, 11_57_07 PM.png"
import { setPaymentLoading } from "../../slices/courseSlice"
import { resetCart } from "../../slices/cartSlice"

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } =
  studentEndpoints

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src

    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

function openDemoCheckout(paymentData, userDetails) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div")
    overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.72);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            z-index: 9999;
            backdrop-filter: blur(6px);
        `

    const modal = document.createElement("div")
    modal.style.cssText = `
            width: min(420px, 100%);
            border-radius: 24px;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
            font-family: Inter, system-ui, sans-serif;
            color: #0f172a;
        `

    modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #1d4ed8, #0f172a); color: white; padding: 22px 24px 20px;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                    <div>
                        <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.75;">Razorpay Demo</div>
                        <div style="font-size:24px; font-weight:700; margin-top:8px;">Complete Payment</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.12); border-radius: 999px; padding: 8px 12px; font-size: 12px; font-weight: 600;">
                        Demo Checkout
                    </div>
                </div>
                <div style="margin-top:16px; font-size:14px; opacity:0.86;">
                    This purchase is simulated locally for demo use.
                </div>
            </div>
            <div style="padding: 24px;">
                <div style="display:grid; gap:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; gap:12px; font-size:14px;">
                        <span style="color:#475569;">Merchant</span>
                        <strong>LEARN & IMPROVE</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; gap:12px; font-size:14px;">
                        <span style="color:#475569;">Amount</span>
                        <strong>${formatCurrency(paymentData.amount)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; gap:12px; font-size:14px;">
                        <span style="color:#475569;">Reference</span>
                        <strong style="max-width:190px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${paymentData.id}</strong>
                    </div>
                </div>

                <div style="margin-top:18px; display:grid; gap:14px;">
                    <label style="display:grid; gap:8px; font-size:14px;">
                        <span style="font-weight:600;">Email</span>
                        <input id="demo-email" value="${userDetails.email || ""}" style="border:1px solid #cbd5e1; border-radius:14px; padding:12px 14px; font-size:14px;" />
                    </label>
                    <label style="display:grid; gap:8px; font-size:14px;">
                        <span style="font-weight:600;">UPI ID</span>
                        <input id="demo-upi-input" placeholder="Enter UPI ID" value="pay@upi" style="border:1px solid #cbd5e1; border-radius:14px; padding:12px 14px; font-size:14px;" />
                    </label>
                    <label style="display:grid; gap:8px; font-size:14px;">
                        <span style="font-weight:600;">UPI PIN</span>
                        <input id="demo-upi-pin" type="text" value="" placeholder="Enter UPI PIN" style="border:1px solid #cbd5e1; border-radius:14px; padding:12px 14px; font-size:14px;" />
                    </label>
                    <div id="demo-payment-error" style="min-height:20px; color:#dc2626; font-size:13px;"></div>
                </div>

                <div style="margin-top:22px; display:flex; gap:12px;">
                    <button id="demo-cancel" type="button" style="flex:1; border:1px solid #cbd5e1; background:white; color:#334155; border-radius:16px; padding:13px 16px; font-weight:600; cursor:pointer;">Cancel</button>
                    <button id="demo-pay" type="button" style="flex:1; border:none; background:#16a34a; color:white; border-radius:16px; padding:13px 16px; font-weight:700; cursor:pointer;">Pay ${formatCurrency(paymentData.amount)}</button>
                </div>
            </div>
        `

    const cleanup = () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
    }

    const emailInput = modal.querySelector("#demo-email")
    const upiInput = modal.querySelector("#demo-upi-input")
    const upiPinInput = modal.querySelector("#demo-upi-pin")
    const errorBox = modal.querySelector("#demo-payment-error")
    const cancelButton = modal.querySelector("#demo-cancel")
    const payButton = modal.querySelector("#demo-pay")

    cancelButton.addEventListener("click", () => {
      cleanup()
      resolve(null)
    })

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        cleanup()
        resolve(null)
      }
    })

    payButton.addEventListener("click", () => {
      const upiValue = String(upiInput.value || "").trim()
      const upiPinValue = String(upiPinInput.value || "").trim()
      if (!upiValue) {
        errorBox.textContent = "Enter your UPI ID to continue."
        return
      }
      if (!/^\d{4,6}$/.test(upiPinValue)) {
        errorBox.textContent = "Enter a valid UPI PIN."
        return
      }

      payButton.textContent = "Processing..."
      payButton.disabled = true
      cancelButton.disabled = true

      window.setTimeout(() => {
        cleanup()
        resolve({
          razorpay_order_id: paymentData.id,
          razorpay_payment_id: `payment_${Date.now()}`,
          razorpay_signature: "signature",
          razorpay_email: emailInput.value,
          razorpay_contact: upiInput.value,
        })
      }, 900)
    })

    overlay.appendChild(modal)
    document.body.appendChild(overlay)
    upiInput.focus()
  })
}

export async function BuyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...")
  try {
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    const paymentData = orderResponse.data.data

    if (paymentData.demoMode) {
      const demoResponse = await openDemoCheckout(paymentData, userDetails)

      if (!demoResponse) {
        toast.error("Payment cancelled")
        return
      }

      const isVerified = await verifyPayment(
        {
          ...demoResponse,
          courses,
        },
        token,
        navigate,
        dispatch
      )

      if (isVerified) {
        await sendPaymentSuccessEmail(
          {
            razorpay_order_id: demoResponse.razorpay_order_id,
            razorpay_payment_id: demoResponse.razorpay_payment_id,
          },
          paymentData.amount,
          token
        )
        toast.success("Payment successful")
      }

      return
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error("RazorPay SDK failed to load")
      return
    }

    const razorpayKey = paymentData.key || process.env.REACT_APP_RAZORPAY_KEY

    if (!razorpayKey) {
      throw new Error(
        "Razorpay key is missing. Configure it in the backend response or REACT_APP_RAZORPAY_KEY."
      )
    }

    const options = {
      key: razorpayKey,
      currency: paymentData.currency,
      amount: `${paymentData.amount}`,
      order_id: paymentData.id,
      name: "LEARN & IMPROVE",
      description: "Thank You for Purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: async function (response) {
        const isVerified = await verifyPayment(
          { ...response, courses },
          token,
          navigate,
          dispatch
        )

        if (isVerified) {
          await sendPaymentSuccessEmail(response, paymentData.amount, token)
        }
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR.....", error)
    toast.error(error?.response?.data?.message || error.message || "Could not make Payment")
  }
  toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error)
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("payment Successful, ypou are addded to the course")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
    return true
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error)
    toast.error(error?.response?.data?.message || error.message || "Could not verify Payment")
    return false
  } finally {
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
  }
}
