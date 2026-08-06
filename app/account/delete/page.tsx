import type { Metadata } from "next";
import LegalPage, { A, H2, P, Strong } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Delete your account — TrimTrack",
  description:
    "How to permanently delete your TrimTrack account and everything in it.",
  alternates: {
    canonical: "https://www.trimtrack.fit/account/delete",
  },
};

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account" current="/account/delete">
      <P>
        You can delete your TrimTrack account yourself, at any time, without
        asking us. It is immediate and permanent.
      </P>

      <H2>In the app</H2>
      <P>
        Open <Strong>You</Strong>, scroll to the bottom, and tap{" "}
        <Strong>Delete account</Strong>. You will be asked to confirm twice —
        once by typing the word DELETE — and then signed out.
      </P>

      <H2>What gets removed</H2>
      <P>
        Every meal you have logged, your weight history, your goals and profile,
        your Circle posts along with the cheers and replies on them, your coach
        conversations, your reminder settings, and your account record. Nothing
        is kept in a recoverable form, so we cannot restore any of it afterwards.
      </P>

      <H2>If you cannot get into the app</H2>
      <P>
        Email <A href="mailto:privacy@trimtrack.fit">privacy@trimtrack.fit</A>{" "}
        from the address on the account and we will delete it for you within 30
        days, usually much sooner.
      </P>

      <H2>Before you go</H2>
      <P>
        If you want a copy of your data first, email{" "}
        <A href="mailto:privacy@trimtrack.fit">privacy@trimtrack.fit</A> and ask
        — we will send everything we hold before anything is deleted.
      </P>
    </LegalPage>
  );
}
