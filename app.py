from flask import Flask, render_template, request

app = Flask(__name__)

# Rota da Home
@app.route('/')
def index():
    return render_template('index.html', title="Home")

# Rota Sobre
@app.route('/sobre')
def sobre():
    return render_template('sobre.html', title="Sobre")

# Rota Serviços
@app.route('/servicos')
def servicos():
    return render_template('services.html', title="Serviços")

# Rota Contato (GET exibe a página, POST envia o email)
@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        # Aqui você captura os dados do Python!
        nome = request.form.get('nome')
        email = request.form.get('email')
        mensagem = request.form.get('mensagem')
        
        # Lógica para enviar email ou salvar no banco...
        print(f"Novo contato de: {nome}") 
        
    return render_template('contato.html', title="Contato")

if __name__ == '__main__':
    app.run(debug=True)