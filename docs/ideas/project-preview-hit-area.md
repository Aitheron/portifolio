# Área Clicável Integral da Prévia

## Problem Statement

Como tornar todo o retângulo da imagem clicável para o recrutador sem transformar gestos de navegação em aberturas acidentais?

## Recommended Direction

Adicionar um plano 3D invisível, contínuo e ligeiramente à frente da prévia. A imagem e seus fragmentos permanecem apenas como apresentação; o novo plano passa a ser a superfície oficial de interação, independentemente do estado da animação.

Como partículas dos clusters podem estar fisicamente à frente desse plano, o gerenciador de eventos da cena deve ordenar as interseções primeiro pela prioridade semântica e depois pela distância. Assim, a prévia recebe o clique em toda a moldura mesmo quando há geometria decorativa sobreposta; elementos com a mesma prioridade preservam o comportamento físico normal.

Um clique curto em qualquer ponto da moldura abre o projeto. Um movimento maior entre pressionar e soltar é tratado como navegação e não abre o painel lateral.

## Key Assumptions to Validate

- [ ] O plano acompanha o `Billboard` e permanece alinhado à imagem em qualquer ângulo.
- [ ] Uma tolerância de 6 pixels diferencia o tremor natural de um arraste intencional.
- [ ] O material invisível continua participando do raycast sem afetar a renderização.
- [ ] Partículas e clusters continuam clicáveis fora da área de uma prévia.

## MVP Scope

- Hitbox retangular cobrindo toda a moldura da prévia.
- Prioridade semântica da hitbox sobre geometrias decorativas interceptadas pelo mesmo raio.
- Distinção entre clique curto e arraste.
- Cursor de interação em toda a imagem.
- Testes para clique sem deslocamento, movimento tolerável e arraste.

## Not Doing (and Why)

- Botão HTML sobre a imagem — prejudicaria a manipulação da cena 3D.
- Clique fora da moldura — aumentaria a chance de seleções acidentais.
- Mudança no efeito fragmentado — não é necessária para corrigir a interação.
- Mudança na câmera ou no painel lateral — estão fora do escopo deste ajuste.

## Open Questions

- A tolerância de 6 pixels continua confortável em dispositivos de alta densidade?
- Quando duas prévias se sobrepõem, a mais próxima continua vencendo por distância.
