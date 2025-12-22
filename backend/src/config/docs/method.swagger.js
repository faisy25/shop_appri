export const makeGet = (tag, summary, responseSchema, isArray = false) => ({
  summary,
  tags: [tag],
  responses: {
    200: {
      description: `${summary} [success]`,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/SuccessResponse' },
              {
                type: 'object',
                properties: {
                  data: isArray ? { type: 'array', items: responseSchema } : responseSchema,
                },
              },
            ],
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    500: { $ref: '#/components/responses/ServerError' },
  },
});

export const makePost = (tag, summary, requestSchema, responseSchema) => ({
  summary,
  tags: [tag],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },
  responses: {
    201: {
      description: `${summary} [success]`,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/SuccessResponse' },
              {
                type: 'object',
                properties: { data: responseSchema },
              },
            ],
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    500: { $ref: '#/components/responses/ServerError' },
  },
});

export const makePut = (tag, summary, requestSchema, responseSchema) => ({
  summary,
  tags: [tag],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },
  responses: {
    200: {
      description: `${summary} [success]`,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/SuccessResponse' },
              {
                type: 'object',
                properties: { data: responseSchema },
              },
            ],
          },
        },
      },
    },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/ServerError' },
  },
});

export const makePatch = (tag, summary, requestSchema, responseSchema) => ({
  summary,
  tags: [tag],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: requestSchema,
      },
    },
  },
  responses: {
    200: {
      description: `${summary} [success]`,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/SuccessResponse' },
              {
                type: 'object',
                properties: { data: responseSchema },
              },
            ],
          },
        },
      },
    },
    400: { $ref: '#/components/responses/BadRequest' },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/ServerError' },
  },
});

export const makeDelete = (tag, summary, responseSchema) => ({
  summary,
  tags: [tag],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  responses: {
    200: {
      description: `${summary} [success]`,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/SuccessResponse' },
              {
                type: 'object',
                properties: { data: responseSchema },
              },
            ],
          },
        },
      },
    },
    404: { $ref: '#/components/responses/NotFound' },
    500: { $ref: '#/components/responses/ServerError' },
  },
});
