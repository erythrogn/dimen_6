from flask import Flask, render_template, request 

# Inicializa a aplicação Flask
app = Flask(__name__)

# ==================================================
# ROTA HOME (Raiz do site)
# ==================================================
@app.route('/')
def index():
    # Renderiza o index.html usando o base.html como modelo
    return render_template('index.html', title="Home")

# ==================================================
# ROTA SOBRE
# ==================================================
@app.route('/sobre')
def sobre():
    return render_template('sobre.html', title="Sobre")

# ==================================================
# ROTA SERVIÇOS
# ==================================================
@app.route('/servicos')
def servicos():
    return render_template('services.html', title="Serviços")

# ==================================================
# ROTA CONTATO
# ==================================================
@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        # Captura os dados enviados pelo formulário
        nome = request.form.get('nome')
        email = request.form.get('email')
        mensagem = request.form.get('mensagem')
        
        # Aqui você vê no terminal do VS Code se funcionou
        print(f"\n--- NOVO CONTATO RECEBIDO ---")
        print(f"Nome: {nome}")
        print(f"Email: {email}")
        print(f"Mensagem: {mensagem}")
        print(f"-----------------------------\n")
        
        # Em um cenário real, aqui entraria o código para enviar e-mail
        # ou salvar no banco de dados.
        
        # Retorna a página (o JavaScript no front-end exibe o alerta de sucesso)
        return render_template('contato.html', title="Contato", success=True)
        
    return render_template('contato.html', title="Contato")

# ==================================================
# INICIALIZAÇÃO DO SERVIDOR
# ==================================================
if __name__ == '__main__':
    # debug=True faz o site recarregar sozinho quando você salva alterações
    app.run(debug=True)