# Aitheron: conteúdo e evidências

O case usa `src/content/projects/aitheron.json` e o renderer genérico do portfólio. A figura 4 é a capa. Os textos PT/EN descrevem triagem acadêmica, sem alegar validação clínica prospectiva.

## Fontes disponíveis

- Prompt fornecido: identidade, modelo, treinamento, papel do autor e limitações.
- `tabela_1.pdf`: métricas completas e limiares por gene, conferidos por extração do texto do PDF.
- `tabela_2.pdf` e `tabela_3.pdf`: matrizes de confusão BRCA1 e BRCA2.
- Figuras 1–4: pipeline, arquitetura, matrizes de confusão e aplicação.

Não foram fornecidos o TCC final nem o artigo científico nesta sessão. Nenhum artigo foi publicado ou usado como fonte sem estar disponível. A avaliação biomédica qualitativa opcional não foi acrescentada sem o documento de suporte.

## Arquivos públicos

Todos os caminhos abaixo são relativos a `public/assets/projects/aitheron/`:

- `cover/aitheron-cover.png`: figura 4 original, sem perda de qualidade.
- `diagrams/pipeline-pt.png`: figura 1 original.
- `diagrams/pipeline-en.svg`: tradução estática do mesmo fluxo.
- `diagrams/architecture-pt.png`: figura 2 original.
- `diagrams/architecture-en.svg`: tradução estática dos componentes e conexões.
- `results/confusion-matrices-pt.png`: figura 3 original.
- `results/confusion-matrices-en.svg`: mesmos valores com títulos e eixos em inglês.

As quatro mídias constam em `gallery[]` e aparecem no ponto correspondente de `content[]`. O renderer omite na galeria final as imagens já colocadas na narrativa. A capa reaparece apenas na seção de visualização, depois dos resultados.

## Imagens por idioma

Extensão opcional autorizada: `srcByLocale`, um mapa de idioma para caminho de imagem. `src` continua obrigatório e é o fallback. Cada variante passa pela mesma validação de URL e arquivos locais. O case e a textura do projeto usam a mesma resolução de caminho.

```json
{
  "src": "/assets/projects/aitheron/diagrams/pipeline-pt.png",
  "srcByLocale": {
    "en": "/assets/projects/aitheron/diagrams/pipeline-en.svg"
  }
}
```

Nenhuma dependência de Mermaid foi adicionada. O schema não tem tabela editorial; os destaques usam blocos `metric`, e as métricas complementares usam texto localizado.

## TCC pendente

Colocar o PDF final, quando disponível, em:

`public/assets/projects/aitheron/documents/aitheron-tcc-marlon-de-souza.pdf`

Nenhum PDF fictício ou CTA quebrado foi criado. O schema atual de links de projeto aceita somente HTTPS; ao disponibilizar o TCC, será necessário configurar sua URL HTTPS real ou autorizar suporte a documento local no campo de links. Não presumir o domínio do portfólio nem publicar o artigo em desenvolvimento.

## Verificação

- `npm test`, `npm run typecheck` e `npm run build`: aprovados.
- Chromium/Playwright: PT em 1440 px e EN em 390 px; abertura do case, 16 métricas, cinco imagens decodificadas (capa e quatro imagens editoriais), seleção de diagramas por idioma e navegação ao curso verificadas.
- Nenhum erro de página nem resposta HTTP de erro para os assets do Aitheron nesses percursos.
- Sete sinais cadastrados; a quantidade de satélites simultâneos respeita o orçamento existente do motor. AUROC recebe prioridade 0.97 para permanecer visível também no orçamento mobile.
- Os PNGs originais foram copiados integralmente. Os SVGs em inglês preservam o fluxo, os componentes e os valores das figuras fornecidas.
