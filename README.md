# Prueba para sales engineer Kushski


## Preguntas

### Experiencia de Onboarding con Kushki. Oportunidades de mejoras identificadas.

No pude realizar la experiencia del Onboarding de la plataforma debido a que yo pude ingresar al modulo por que genera un error y no me dejaba crear la cuenta.

### Experiencia con la documentación técnica. Oportunidades de mejoras identificadas y propuesta de mejora de la misma.

La documentacion es entendible y practica, esta bien distribuida aunque hay ciertos cambios de palabres o nombres, como por ejemplo en la prueba se menciona un pre-authorize payment pero en la documentacion es authorized payment, eso en api-docs, en docs.kushki no se  menciona ese tipo de pagos como pagos autorizados sino como **Reserva fondos bajo demanda** lo cual no tiene relacion con el nombre antes mencionado.
La documentacion esta bien distribuida (api-docs).

Un punto adicional es que el api de **Void a transaction** aparece 2 veces en api-docs:

```sh
  [DELETE] /payouts/transfer/v1/transaction/{ticketNumber}
```

```sh
  [DELETE] /v1/charges/{ticketNumber}
```

Pero en docs.kushki solo se menciona el segundo.

### Qué entiendes por el concepto de tokenización y por qué cree que se recomienda tokenizar por medio de una solución del frontend?.
La tokenizacion permite la reducción de riesgos de que cualquier sistema pueda acceder a los datos personales de las tarjetas de crédito, haciéndolos mas seguros cifrando el (PAN), esto permite almacenar los datos personales cumpliendo con las normativas.


### Qué entiendes por el concepto de Webhook y cuál es su utilidad?. 
Es una tecnología que se base en eventos, permitiendo integración de servicios. Que no necesita una solicitud para dar una respuesta como es el caso de las api.
