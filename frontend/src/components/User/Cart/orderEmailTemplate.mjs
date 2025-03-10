import mjml2html from 'mjml';

export function generateOrderConfirmationEmail({ user, orderId, total, cart }) {
  const mjmlTemplate = `
<mjml>
  <mj-head>
    <mj-title>Order Confirmation</mj-title>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" />
    <mj-attributes>
      <mj-all font-family="Roboto, Helvetica, sans-serif" />
      <mj-class name="center-text" align="center" />
    </mj-attributes>
    <mj-style inline="inline">
      .main-card {
        border-radius: 8px;
        overflow: hidden;
      }
    </mj-style>
  </mj-head>
  <mj-body background-color="#FFCDD2" width="600px">
    <!-- Header Section with Luminous Reddish Background and Pinkish Red Text -->
    <mj-section background-color="#FFCDD2" padding="5px" text-align="center">
      <mj-column>
       
        <mj-text css-class="center-text" font-size="24px" color="#FF6F61" font-weight="bold">
          NFR
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Main Content Card -->
    <mj-wrapper css-class="main-card" background-color="#ffffff" padding="20px">
      <mj-section padding="0">
        <mj-column>
          <mj-text css-class="center-text" font-size="20px" color="#FF6F61" font-weight="bold">
            Order Confirmation
          </mj-text>
          <mj-text css-class="center-text" font-size="16px" color="#555555">
            Hello ${user.first_name},
          </mj-text>
          <mj-text css-class="center-text" font-size="16px" color="#555555">
            Thank you for your order!
          </mj-text>
          <mj-text css-class="center-text" font-size="16px" color="#555555">
            <strong>Order ID:</strong> ${orderId}<br />
            <strong>Total Amount:</strong> KSh ${total}
          </mj-text>
          <mj-divider border-color="#dddddd" border-width="1px" padding="10px 0" />
          <mj-text css-class="center-text" font-size="18px" color="#1d3557" font-weight="bold">
            Order Details:
          </mj-text>
          ${cart.map(item => `
            <mj-text css-class="center-text" font-size="16px" color="#555555">
              ${item.name} x ${item.quantity}
            </mj-text>
          `).join('')}
          <mj-button href="" background-color="#FF6F61" color="#ffffff" font-size="16px" font-weight="bold" border-radius="4px" padding="15px 25px" align="center">
            View Order Details
          </mj-button>
          <mj-text css-class="center-text" font-size="16px" color="#555555">
            We appreciate your business!
          </mj-text>
          <mj-text css-class="center-text" font-size="16px" color="#555555">
            Best regards,<br/>NFR
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>

    <!-- Footer with Social Media Icons -->
    <mj-section padding="20px" background-color="#FFCDD2">
      <mj-column>
        <mj-social mode="horizontal" align="center" padding="10px 0">
          <mj-social-element name="facebook" href="https://facebook.com/yourpage" background-color="#3b5998" />
          <mj-social-element name="twitter" href="https://twitter.com/yourpage" background-color="#55acee" />
          <mj-social-element name="instagram" href="https://instagram.com/yourpage" background-color="#e4405f" />
        </mj-social>
        <mj-text css-class="center-text" font-size="12px" color="#999999">
          © ${new Date().getFullYear()} NFR Store. All rights reserved.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;

  const { html, errors } = mjml2html(mjmlTemplate);
  if (errors && errors.length > 0) {
    console.error("MJML compilation errors:", errors);
  }
  return html;
}
