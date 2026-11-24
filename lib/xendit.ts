const XENDIT_API_URL = "https://api.xendit.co"

export interface CreateInvoiceParams {
  externalId: string
  amount: number
  payerEmail: string
  description: string
  successRedirectUrl: string
  failureRedirectUrl: string
}

export interface XenditInvoiceResponse {
  id: string
  external_id: string
  status: string
  invoice_url: string
}

export async function createXenditInvoice(
  params: CreateInvoiceParams
): Promise<XenditInvoiceResponse> {
  const secretKey = process.env.XENDIT_SECRET_KEY
  if (!secretKey) {
    throw new Error("XENDIT_SECRET_KEY belum dikonfigurasi")
  }

  // Safe fallback mock for local testing when placeholder key is in use
  if (secretKey === "xnd_development_placeholder_key") {
    const mockId = `inv_mock_${params.externalId}`
    return {
      id: mockId,
      external_id: params.externalId,
      status: "PENDING",
      invoice_url: `https://checkout-staging.xendit.co/v2/${mockId}`,
    }
  }

  const basicAuth = Buffer.from(`${secretKey}:`).toString("base64")

  const response = await fetch(`${XENDIT_API_URL}/v2/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      payer_email: params.payerEmail,
      description: params.description,
      currency: "IDR",
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gagal membuat invoice Xendit: ${errorText}`)
  }

  return (await response.json()) as XenditInvoiceResponse
}
