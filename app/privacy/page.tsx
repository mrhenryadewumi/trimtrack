import type { Metadata } from "next";
import LegalPage, { A, H2, LI, P, Strong, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — TrimTrack",
  description:
    "What TrimTrack collects, why, who else sees it, and how to get it deleted.",
  alternates: {
    canonical: "https://www.trimtrack.fit/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="30 August 2026" current="/privacy">
      <P>
        TrimTrack is operated by <Strong>Rainclean Solutions Limited</Strong>,
        trading as Tapin Studio, a company registered in England and Wales,
        company number <Strong>16751715</Strong>, at{" "}
        <Strong>
          4 Ashwood Croft, Hebburn, NE31 1BT, United Kingdom
        </Strong>
        .
      </P>

      <H2>What we collect</H2>
      <P>
        <Strong>Account</Strong> — your email address and a password. Passwords
        are stored hashed; we never see them.
      </P>
      <P>
        <Strong>What you log</Strong> — meals, calories and macros, your weight
        and weight history, your height, your goals, and the dates and times you
        logged them.
      </P>
      <P>
        <Strong>Photos of meals</Strong> — only when you use the scan feature.
        The photo is sent to our AI provider to identify the food, then
        discarded. We do not keep your meal photos, and they are not used to
        train any model.
      </P>
      <P>
        <Strong>What you post</Strong> — anything you write in Circle, including
        your weight numbers if you choose to share them. Posts are visible to
        other TrimTrack users.
      </P>
      <P>
        <Strong>Coach conversations</Strong> — the messages you send the AI
        coach, so it can answer with your actual diary in view.
      </P>
      <P>
        <Strong>Basic technical data</Strong> — device type, app version, and
        error reports, so we can fix crashes.
      </P>
      <P>
        We do <Strong>not</Strong> collect your location, your contacts, or
        advertising identifiers, and we use no third-party advertising or
        analytics trackers.
      </P>

      <H2>Why we collect it</H2>
      <P>
        To run the app: show your daily totals, track progress over time, let the
        coach give relevant advice, and let the community work. Nothing else.
      </P>

      <H2>Who else sees it</H2>
      <UL>
        <LI>
          <Strong>Supabase</Strong> — hosts our database; stores your account and
          your logs.
        </LI>
        <LI>
          <Strong>Vercel</Strong> — hosts the app.
        </LI>
        <LI>
          <Strong>Anthropic</Strong> — processes meal photos and coach messages.
          They do not train on this data.
        </LI>
        <LI>
          <Strong>Resend</Strong> — sends confirmation and reminder emails.
        </LI>
        <LI>
          <Strong>Stripe</Strong> — payments are switched off while we test.
          We do not take cards.
        </LI>
      </UL>
      <P>
        We do not sell your data. We do not share it with advertisers. We will
        only hand it to authorities where the law compels us to.
      </P>

      <H2>Health data</H2>
      <P>
        TrimTrack is a food and weight diary. It is <Strong>not</Strong> a
        medical device and gives no medical advice. The AI coach cannot diagnose,
        treat, or prescribe. Talk to a doctor before making significant changes
        to how you eat, particularly if you are pregnant, diabetic, or being
        treated for an eating disorder.
      </P>

      <H2>How long we keep it</H2>
      <P>
        Until you delete it. Individual entries can be deleted any time in the
        app. Delete your whole account from{" "}
        <Strong>You → Delete account</Strong> — that permanently removes your
        meals, weight history, goals, posts and coach messages. We cannot recover
        them afterwards.
      </P>

      <H2>Your rights</H2>
      <P>
        Under UK GDPR you can ask for a copy of your data, ask us to correct it,
        or ask us to erase it. Email{" "}
        <A href="mailto:privacy@trimtrack.fit">privacy@trimtrack.fit</A> and we
        will respond within 30 days. You can also complain to the Information
        Commissioner&apos;s Office at <A href="https://ico.org.uk">ico.org.uk</A>
        .
      </P>

      <H2>Children</H2>
      <P>
        TrimTrack is not for under-16s. We do not knowingly collect data from
        children. If you believe a child has an account, email us and we will
        remove it.
      </P>

      <H2>Changes</H2>
      <P>
        If we change this policy we will update the date above and tell you in
        the app before the change takes effect.
      </P>

      <H2>Contact</H2>
      <P>
        Rainclean Solutions Limited (trading as Tapin Studio)
        <br />
        4 Ashwood Croft, Hebburn, NE31 1BT, United Kingdom
        <br />
        <A href="mailto:privacy@trimtrack.fit">privacy@trimtrack.fit</A>
      </P>
    </LegalPage>
  );
}
