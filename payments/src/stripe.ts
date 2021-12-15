import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY || "sk_test_51K6eycIBQl9zedXH1MNm8BEMo6VD5XVHubTsjisLetWS36eSy7k0CR5xFlDtmkJXPnfHCUfHW0lr22gK0FIrBM05008WXNgAkc", {
  apiVersion: "2020-08-27",
});
