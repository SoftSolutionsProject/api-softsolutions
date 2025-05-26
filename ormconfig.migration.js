"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./src/domain/usuario/usuario.entity");
const curso_entity_1 = require("./src/domain/curso/curso.entity");
const modulo_entity_1 = require("./src/domain/modulo/modulo.entity");
const aula_entity_1 = require("./src/domain/aula/aula.entity");
const inscricao_entity_1 = require("./src/domain/inscricao/inscricao.entity");
const dotenv = require("dotenv");
dotenv.config();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [usuario_entity_1.Usuario, curso_entity_1.Curso, modulo_entity_1.Modulo, aula_entity_1.Aula, inscricao_entity_1.Inscricao],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
});
//# sourceMappingURL=ormconfig.migration.js.map