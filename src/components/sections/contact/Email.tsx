import { Body, Container, Head, Heading, Html, Preview, Text, Hr } from '@react-email/components';

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

const projectName = process.env.Project_Name ?? 'Clash of Clans';

export const ContactEmail = ({ name, email, message }: ContactEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{name} sent you a message from Project {projectName}</Preview>
      <Container style={container}>
        <Heading style={h1}>New {projectName} Project Message</Heading>
        <Text style={text}>You&apos;ve received a new message from Project {projectName}: </Text>

        <div style={contactCard}>
          <Text style={contactHeader}>Contact Details</Text>
          <Text style={contactDetail}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={contactDetail}>
            <strong>Email:</strong> {email}
          </Text>
        </div>

        <Text style={messageHeader}>Message:</Text>
        <div style={messageBox}>
          <Text style={messageText}>{message}</Text>
        </div>

        <Hr style={hr} />

        <Text style={replyNote}>
          💡 <strong>Pro tip:</strong> Simply reply to this email to respond directly to {name}.
        </Text>

        <Text style={footer}>
          This message was sent from your {projectName} Project contact form.
          <br />
          Keep building amazing things! 🚀
        </Text>
      </Container>
    </Body>
  </Html>
);

ContactEmail.PreviewProps = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'Hi! I love your portfolio and would like to discuss a potential project collaboration. Are you available for a quick call this week?',
} as ContactEmailProps;

export default ContactEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 30px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
};

const contactCard = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const contactHeader = {
  color: '#495057',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 12px 0',
};

const contactDetail = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '15px',
  margin: '8px 0',
  lineHeight: '20px',
};

const messageHeader = {
  color: '#495057',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '30px 0 12px 0',
};

const messageBox = {
  backgroundColor: '#ffffff',
  border: '2px solid #e9ecef',
  borderLeft: '4px solid #007bff',
  borderRadius: '6px',
  padding: '20px',
  margin: '12px 0 30px 0',
};

const messageText = {
  color: '#333',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  border: 'none',
  borderTop: '1px solid #e9ecef',
  margin: '30px 0',
};

const replyNote = {
  color: '#6c757d',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '6px',
  border: '1px solid #e9ecef',
  margin: '20px 0',
};

const footer = {
  color: '#6c757d',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  marginTop: '40px',
  marginBottom: '24px',
};