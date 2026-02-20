import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)

# ==========================================
# 1. ROTAS DE NAVEGAÇÃO (PÁGINAS HTML)
# ==========================================

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sobre')
def sobre():
    return render_template('sobre.html')

@app.route('/servicos')
def servicos():
    return render_template('services.html')

# Nova rota GET apenas para mostrar a página de contato
@app.route('/contato', methods=['GET'])
def contato():
    return render_template('contato.html')


# ==========================================
# 2. ROTA DE API (ENVIO DE E-MAIL AJAX)
# ==========================================

# Alterado para /api/contato para bater exatamente com o seu script.js
@app.route('/api/contato', methods=['POST'])
def api_contato():
    """
    Recebe JSON do formulário multi-step e envia e-mail
    para janaran52@gmail.com via SMTP do Gmail.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'ok': False, 'erro': 'Dados inválidos'}), 400

    nome    = data.get('nome', '').strip()
    servico = data.get('servico', '').strip()
    projeto = data.get('projeto', '').strip()

    # Validação mínima
    if not nome or not projeto:
        return jsonify({'ok': False, 'erro': 'Nome e projeto são obrigatórios'}), 422

    # Configurações de envio
    remetente    = os.getenv('MAIL_USER', 'janaran52@gmail.com')
    destinatario = 'janaran52@gmail.com'
    senha        = os.getenv('MAIL_PASS', '')

    assunto = f'[DIMEN6] Novo contato: {servico or "Projeto"} — {nome}'

    # HTML do E-mail mantido com sua estética original
    corpo_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background:#0a1018; color:#e6e6e6; padding:32px;">
        <div style="max-width:600px; margin:0 auto; background:#0d1a2a;
                    border:1px solid rgba(0,243,255,0.15); border-radius:12px; overflow:hidden;">

            <div style="background:linear-gradient(135deg,#050A14,#0d2040);
                        padding:28px 32px; border-bottom:1px solid rgba(0,243,255,0.1);">
                <h1 style="margin:0; font-size:1.4rem; color:#00F3FF; letter-spacing:3px;">DIMEN6</h1>
                <p style="margin:6px 0 0; font-size:0.85rem; color:#888; letter-spacing:1px;">NOVO CONTATO VIA SITE</p>
            </div>

            <div style="padding:32px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px 0; color:#888; font-size:0.8rem; letter-spacing:1.5px; text-transform:uppercase; width:110px; vertical-align:top;">Remetente</td>
                        <td style="padding:10px 0; color:#e6e6e6; font-size:1rem;">{nome}</td>
                    </tr>
                    <tr style="border-top:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:10px 0; color:#888; font-size:0.8rem; letter-spacing:1.5px; text-transform:uppercase; vertical-align:top;">Serviço</td>
                        <td style="padding:10px 0;">
                            <span style="background:rgba(0,243,255,0.1); border:1px solid rgba(0,243,255,0.25); color:#00F3FF; font-size:0.82rem; padding:4px 12px; border-radius:20px; letter-spacing:1px;">
                                {servico or 'Não especificado'}
                            </span>
                        </td>
                    </tr>
                    <tr style="border-top:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:14px 0; color:#888; font-size:0.8rem; letter-spacing:1.5px; text-transform:uppercase; vertical-align:top;">Projeto</td>
                        <td style="padding:14px 0; color:#e6e6e6; font-size:0.97rem; line-height:1.7;">{projeto}</td>
                    </tr>
                </table>
            </div>

            <div style="padding:18px 32px; background:#050A14; border-top:1px solid rgba(255,255,255,0.05); font-size:0.75rem; color:#555; text-align:center;">
                Enviado pelo formulário de contato do site DIMEN6
            </div>
        </div>
    </body>
    </html>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = assunto
    msg['From']    = remetente
    msg['To']      = destinatario
    msg.attach(MIMEText(corpo_html, 'html', 'utf-8'))

    # Envio via SMTP
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(remetente, senha)
            smtp.sendmail(remetente, destinatario, msg.as_string())
        return jsonify({'ok': True}), 200

    except smtplib.SMTPAuthenticationError:
        return jsonify({'ok': False, 'erro': 'Falha de autenticação. Verifique MAIL_PASS no .env'}), 500
    except Exception as e:
        return jsonify({'ok': False, 'erro': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)