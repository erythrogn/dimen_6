from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', title="Home")

@app.route('/sobre')
def sobre():
    return render_template('sobre.html', title="Sobre")

@app.route('/servicos')
def servicos():
    return render_template('services.html', title="Serviços")

@app.route('/contato', methods=['GET', 'POST'])
def contato():
    if request.method == 'POST':
        nome = request.form.get('nome')
        email = request.form.get('email')
        mensagem = request.form.get('mensagem')
        
        print(f"\n--- NOVO CONTATO RECEBIDO ---")
        print(f"Nome: {nome}")
        print(f"Email: {email}")
        print(f"Mensagem: {mensagem}")
        print(f"-----------------------------\n")
        
        return render_template('contato.html', title="Contato", success=True)
        
    return render_template('contato.html', title="Contato")

if __name__ == '__main__':
    app.run(debug=True)