import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "localhost";
const port = 3000;
var listaUsuarios = [];

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "minh4Chav3S3cr3t4",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.get("/", verificarAutenticacao, (req, res) => {
  // Disponilizar o menu para o usuario usando bootstrap
  let ultimoAcesso = req.cookies?.ultimoAcesso;

  if (ultimoAcesso) {
    return res.redirect("/");
  }
  res.setHeader("Content-Type", "text/html");
  const dataAtual = new Date();
  res.cookie("ultimoAcesso", dataAtual.toLocaleString());
  res.write(`
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Menu do sistema</title>

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">Menu</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                                <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Cadastros
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="/cadastroUsuarios">Usuarios</a></li>
                                    <li><a class="dropdown-item" href="/listaUsuarios">Lista de usuarios</a></li>
                                </ul>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class = 'container-fluid'>
                        <div class = 'd-flex'>
                            <div class = 'p-2'>
                                <p> Ultimo  acesso: ${
                                  ultimoAcesso ?? "Primeiro acesso"
                                }</p>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            </html>
        `);
  res.end();
});

app.get("/cadastroUsuarios", verificarAutenticacao, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cadastro de usuarios</title>
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
        crossorigin="anonymous"
        />
    </head>
    <body>
        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Usuarios</h1>
            <form method="POST" action="/adicionarUsuarios" class="row g-3 needs-validation m-3 p-3 bg-light" novalidate>
                <div class="col-md-4">
                    <label for="nome" class="form-label">Primeiro nome</label>
                    <input type="text" class="form-control" id="nome" name="nome" />
                    <div class="invalid-feedback">informe o nome do usuario.</div>
                </div>

                <div class="col-md-4">
                    <label for="sobrenome" class="form-label">Sobrenome</label>
                    <input type="text" class="form-control" id="sobrenome" name="sobrenome" />
                    <div class="invalid-feedback">informe o sobrenome do usuario.</div>
                </div>

                <div class="col-md-4">
                    <label for="usuario" class="form-label">Usuario</label>
                    <div class="input-group">
                        <span class="input-group-text" id="inputGroupPrepend2">@</span>
                        <input type="text" class="form-control" id="usuario" name="usuario" aria-describedby="inputGroupPrepend2" />
                    </div>
                    <div class="invalid-feedback">informe o username do usuario.</div>
                </div>

                <div class="col-md-6">
                    <label for="Cidade" class="form-label">Cidade</label>
                    <input type="text" class="form-control" id="Cidade" name="Cidade" />
                    <div class="invalid-feedback">informe a cidade do usuario.</div>
                </div>

                <div class="col-md-3">
                    <label for="Estado" class="form-label">Estado</label>
                    <select class="form-select" id="Estado" name="Estado">
                        <option value="" disabled selected>Selecione o estado</option>
                        <option value="AC">Acre (AC)</option>
                        <option value="AL">Alagoas (AL)</option>
                        <option value="AP">Amapá (AP)</option>
                        <option value="AM">Amazonas (AM)</option>
                        <option value="BA">Bahia (BA)</option>
                        <option value="CE">Ceará (CE)</option>
                        <option value="DF">Distrito Federal (DF)</option>
                        <option value="ES">Espírito Santo (ES)</option>
                        <option value="GO">Goiás (GO)</option>
                        <option value="MA">Maranhão (MA)</option>
                        <option value="MT">Mato Grosso (MT)</option>
                        <option value="MS">Mato Grosso do Sul (MS)</option>
                        <option value="MG">Minas Gerais (MG)</option>
                        <option value="PA">Pará (PA)</option>
                        <option value="PB">Paraíba (PB)</option>
                        <option value="PR">Paraná (PR)</option>
                        <option value="PE">Pernambuco (PE)</option>
                        <option value="PI">Piauí (PI)</option>
                        <option value="RJ">Rio de Janeiro (RJ)</option>
                        <option value="RN">Rio Grande do Norte (RN)</option>
                        <option value="RS">Rio Grande do Sul (RS)</option>
                        <option value="RO">Rondônia (RO)</option>
                        <option value="RR">Roraima (RR)</option>
                        <option value="SC">Santa Catarina (SC)</option>
                        <option value="SP">São Paulo (SP)</option>
                        <option value="SE">Sergipe (SE)</option>
                        <option value="TO">Tocantins (TO)</option>
                    </select>
                    <div class="invalid-feedback">informe o estado do usuario.</div>
                </div>

                <div class="col-md-3">
                    <label for="cep" class="form-label">CEP</label>
                    <input type="text" class="form-control" id="cep" name="cep" />
                    <div class="invalid-feedback">informe o CEP do usuario.</div>
                </div>

                <div class="col-12">
                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
            </form>
        </div>
    </body>
    </html>
    `);
});

app.post("/adicionarUsuarios", verificarAutenticacao, (req, res) => {
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  const usuario = req.body.usuario;
  const cidade = req.body.Cidade;
  const estado = req.body.Estado;
  const cep = req.body.cep;

  if (nome && sobrenome && usuario && cidade && estado && cep) {
    listaUsuarios.push({
      nome,
      sobrenome,
      usuario,
      cidade,
      estado,
      cep,
    });
    res.redirect("/listaUsuarios");
  } else {
    let conteudo = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Cadastro de usuarios</title>
            <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
            crossorigin="anonymous"
            />
        </head>
        <body>
            <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Usuarios</h1>
            <form method="POST" action="/adicionarUsuarios" class="row g-3 needs-validation m-3 p-3 bg-light">
                <div class="col-md-4">
                    <label for="nome" class="form-label">Primeiro nome</label>
                    <input type="text" class="form-control" id="nome" name="nome" value = "${nome}"/>
                </div>
                `;
    if (!nome) {
      conteudo += `<div><p class="text-danger">O campo Nome é obrigatório.</p></div>`;
    }

    conteudo += `<div class="col-md-4">
                    <label for="sobrenome" class="form-label">Sobrenome</label>
                    <input type="text" class="form-control" id="sobrenome" name="sobrenome" value = "${sobrenome}"/>
                `;
    if (!sobrenome) {
      conteudo += `<div><p class="text-danger">O campo Sobrenome é obrigatório.</p></div>`;
    }

    conteudo += `
        </div><div class="col-md-4">
                    <label for="usuario" class="form-label">Usuario</label>
                    <div class="input-group">
                        <span class="input-group-text" id="inputGroupPrepend2">@</span>
                        <input type="text" class="form-control" id="usuario" name="usuario" aria-describedby="inputGroupPrepend2" value = "${usuario}"/>
                    </div>
                `;
    if (!usuario) {
      conteudo += `<div><p class="text-danger">O campo Usuario é obrigatório.</p></div>`;
    }

    conteudo += `
        </div>
        <div class="col-md-6">
                    <label for="Cidade" class="form-label">Cidade</label>
                    <input type="text" class="form-control" id="Cidade" name="Cidade" value = "${cidade}"/>
                `;
    if (!cidade) {
      conteudo += `<div><p class="text-danger">O campo Cidade é obrigatório.</p></div>`;
    }

    conteudo += `
        </div>
            <div class="col-md-3">
                    <label for="Estado" class="form-label">Estado</label>
                    <select class="form-select" id="Estado" name="Estado" value = "${estado}">
                        <option value=""disabled selected>Selecione o estado</option>
                        <option value="AC">Acre (AC)</option>
                        <option value="AL">Alagoas (AL)</option>
                        <option value="AP">Amapá (AP)</option>
                        <option value="AM">Amazonas (AM)</option>
                        <option value="BA">Bahia (BA)</option>
                        <option value="CE">Ceará (CE)</option>
                        <option value="DF">Distrito Federal (DF)</option>
                        <option value="ES">Espírito Santo (ES)</option>
                        <option value="GO">Goiás (GO)</option>
                        <option value="MA">Maranhão (MA)</option>
                        <option value="MT">Mato Grosso (MT)</option>
                        <option value="MS">Mato Grosso do Sul (MS)</option>
                        <option value="MG">Minas Gerais (MG)</option>
                        <option value="PA">Pará (PA)</option>
                        <option value="PB">Paraíba (PB)</option>
                        <option value="PR">Paraná (PR)</option>
                        <option value="PE">Pernambuco (PE)</option>
                        <option value="PI">Piauí (PI)</option>
                        <option value="RJ">Rio de Janeiro (RJ)</option>
                        <option value="RN">Rio Grande do Norte (RN)</option>
                        <option value="RS">Rio Grande do Sul (RS)</option>
                        <option value="RO">Rondônia (RO)</option>
                        <option value="RR">Roraima (RR)</option>
                        <option value="SC">Santa Catarina (SC)</option>
                        <option value="SP">São Paulo (SP)</option>
                        <option value="SE">Sergipe (SE)</option>
                        <option value="TO">Tocantins (TO)</option>
                    </select>
               `;
    if (!estado) {
      conteudo += `<div><p class="text-danger">O campo Estado é obrigatório.</p></div>`;
    }

    conteudo += `
         </div><div class="col-md-3">
                    <label for="cep" class="form-label">CEP</label>
                    <input type="text" class="form-control" id="cep" name="cep" value = "${cep}"/>
                `;
    if (!cep) {
      conteudo += `<div><p class="text-danger">O campo CEP é obrigatório.</p></div>`;
    }

    conteudo += `
        </div>
        <div class="col-12">
                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
            </form>
            </div>
        </body>
        </html>
        `;

    res.send(conteudo);
  }
});

app.get("/listaUsuarios", verificarAutenticacao, (req, res) => {
  let tabelaUsuarios = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lista de Usuarios</title>
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
        crossorigin="anonymous"
        />
    </head>
    <body>

        <div class="container">
        <h1 class="text-center border m-3 p-3 bg-light">Lista de Usuarios Cadastrados</h1>
        <table class="table table-striped table-hover">
            <thead class="table-dark">
            <tr>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Usuario</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>CEP</th>
            </tr>
            </thead>
            <tbody>
    `;
  for (let i = 0; i < listaUsuarios.length; i++) {
    tabelaUsuarios += `
            <tr>
                <td>${listaUsuarios[i].nome}</td>
                <td>${listaUsuarios[i].sobrenome}</td>
                <td>${listaUsuarios[i].usuario}</td>    
                <td>${listaUsuarios[i].cidade}</td>
                <td>${listaUsuarios[i].estado}</td>
                <td>${listaUsuarios[i].cep}</td>
            </tr>
        `;
  }
  tabelaUsuarios += `
            </tbody>
        </table>
        <a href="/cadastroUsuarios" class="btn btn-secondary">Voltar</a>
        </div>
    </body>
    <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"
    ></script>
    </html>
    `;
  res.send(tabelaUsuarios);
});

app.get("/login", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />    
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <form method="POST" action="/login">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" />
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.logado = true;
    req.session.NomeUsuario = "Administrador";
    res.redirect("/");
  } else {
    res.write(`<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />    
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <form method="POST" action="/login">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" />
                <button type="submit">Login</button>
            </form>
            <p style="color:red;">Credenciais inválidas. Tente novamente.</p>
        </body>
        </html>
        `);
  }
});

app.get("/logout", (req, res) => {
  //req.session.logado = false;
  req.session.destroy();
  res.redirect("/login");
});

function verificarAutenticacao(req, res, next) {
  if (req.session?.logado) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
