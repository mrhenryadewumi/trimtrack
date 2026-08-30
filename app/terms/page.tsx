import type { Metadata } from "next";
import LegalPage, { A, H2, P, Strong } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use — TrimTrack",
  description:
    "What TrimTrack is and isn't, your account, the community and liability.",
  alternates: {
    canonical: "https://www.trimtrack.fit/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="30 August 2026" current="/terms">
      <P>
        By using TrimTrack you agree to these terms. If you don&apos;t,
        don&apos;t use it.
      </P>

      <H2>What TrimTrack is</H2>
      <P>
        A food and weight diary with an AI assistant and a community. It
        estimates calories; those estimates are approximations, not measurements.
        Scanned photos and database entries can be wrong. Use your judgement.
      </P>

      <H2>What it isn&apos;t</H2>
      <P>
        Medical advice, a diagnosis, a treatment, or a substitute for a doctor,
        dietitian or therapist. We make no promise about how much weight you will
        lose or how fast. If you have a health condition, speak to a professional
        before changing how you eat.
      </P>

      <H2>Your account</H2>
      <P>
        One account per person. Keep your password to yourself. You&apos;re
        responsible for what happens under your account. You must be 16 or older.
      </P>

      <H2>The community</H2>
      <P>
        Circle is public to other members. Don&apos;t post anything you
        wouldn&apos;t want read back to you. We remove content that harasses,
        sells supplements, promotes disordered eating, or breaks the law — and we
        can suspend accounts that keep doing it. Your posts remain yours; by
        posting you let us display them in the app.
      </P>

      <H2>Price</H2>
      <P>
        TrimTrack is free while we test it with people. No card is taken. If a
        paid plan is ever introduced, we will tell you before it starts. Nobody
        is charged today.
      </P>

      <H2>Ending it</H2>
      <P>
        You can delete your account whenever you like, in the app. We can close
        accounts that break these terms. Deletion is permanent.
      </P>

      <H2>Liability</H2>
      <P>
        TrimTrack is provided as-is. To the extent the law allows, we&apos;re not
        liable for losses arising from your use of it, including decisions made
        on the basis of a calorie estimate. Nothing here limits liability we
        cannot legally limit.
      </P>

      <H2>Law</H2>
      <P>
        These terms are governed by the law of England and Wales.
      </P>

      <H2>Contact</H2>
      <P>
        <A href="mailto:hello@trimtrack.fit">hello@trimtrack.fit</A>
      </P>

      <P>
        <Strong>Rainclean Solutions Limited</Strong>, trading as Tapin Studio.
        Company number 16751715, registered in England and Wales.
        <br />4 Ashwood Croft, Hebburn, NE31 1BT, United Kingdom
      </P>
    </LegalPage>
  );
}
