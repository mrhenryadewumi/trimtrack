import type { Metadata } from "next";
import LegalPage, { A, H2, P, Strong } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Help with TrimTrack",
  description:
    "Common questions, how to reach a person, and how to get your data or delete your account.",
};

export default function SupportPage() {
  return (
    <LegalPage title="Help with TrimTrack" current="/support">
      <P>
        Email <A href="mailto:hello@trimtrack.fit">hello@trimtrack.fit</A> — a
        real person reads it, usually within two working days.
      </P>

      <H2>Things people ask</H2>
      <P>
        <Strong>A calorie count looks wrong.</Strong> Tap the number and change
        it. The scan estimates from a photo, so it&apos;s an estimate — your
        correction is what gets saved.
      </P>
      <P>
        <Strong>A food is missing.</Strong> Email us the dish and we&apos;ll add
        it. This is how the database grew in the first place.
      </P>
      <P>
        <Strong>I forgot my password.</Strong> Tap &quot;Forgot password?&quot;
        on the login screen.
      </P>
      <P>
        <Strong>My meals aren&apos;t showing.</Strong> Check you&apos;re logged
        into the right account, then pull down on Today to refresh. If you logged
        offline, the entries sync when you reconnect.
      </P>
      <P>
        <Strong>I want my data.</Strong> Email{" "}
        <A href="mailto:privacy@trimtrack.fit">privacy@trimtrack.fit</A> and
        we&apos;ll send you everything we hold within 30 days.
      </P>
      <P>
        <Strong>I want my account gone.</Strong> You → Delete account. It&apos;s
        immediate and permanent.
      </P>

      <H2>Reporting a post</H2>
      <P>
        Every post in Circle has a report option. We look at reports within 24
        hours.
      </P>

      <H2>Not a medical service</H2>
      <P>
        TrimTrack is a diary, not a clinic. We can&apos;t advise on medical
        conditions, medication, or eating disorders. If you&apos;re struggling
        with food, Beat&apos;s helpline is 0808 801 0677.
      </P>
    </LegalPage>
  );
}
