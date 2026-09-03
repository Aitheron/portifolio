import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const securityHeaders = [
  {key: "X-Content-Type-Options", value: "nosniff"},
  {key: "X-Frame-Options", value: "DENY"},
  {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {key: "Strict-Transport-Security", value: "max-age=31536000"},
];

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  async headers() {
    return [{source: "/(.*)", headers: securityHeaders}];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
