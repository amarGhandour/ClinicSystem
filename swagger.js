const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Clinic Management system",
        version: "1.0.0",
        description:
          `CMS is a web-based application for managing multiple clinic’s data along with
          providing common access clinic’s doctors and receptionists.`
      },
      servers: [
        {
          url: "http://localhost:8080/api/v1/",
          description: 'Development server'
        },
      ],
      components: {
        schemas: {
            Review: {
                type: 'object',
                required: ['title', 'text', 'rating', 'doctor','patient'],
                properties: {
                    title: {
                        type: 'string',
                        description: 'The Title of the Review'
                    },
                    text: {
                        type: 'string',
                        description: 'The Content of the Review'
                    },
                    rating: {
                        type: 'integer',
                        description: 'The Rating'
                    },
                    doctor: {
                        type: 'integer',
                        description: 'The Doctor ID'
                    }
                    ,
                    patient: {
                        type: 'integer',
                        description: 'The Patient ID'
                    }
                },
                example: {
                    
                    "title": "Review For Dr.Ahmed",
                    "text": "Dr.Ahmed is incredible.",
                    "rating": 9,
                    "doctor": 28,
                    "patient": 8,
                    
                }
            },
            Appointment: {
                type: 'object',
                required: ['clinic', 'doctor', 'patient', 'payment','day'],
                properties: {
                    clinic: {
                        type: 'integer',
                        description: 'The ID of The Clinic'
                    },
                    doctor: {
                        type: 'integer',
                        description: 'The ID of The Doctor'
                    },
                    patient: {
                        type: 'integer',
                        description: 'The ID of The Patient'
                    },
                    payment: {
                        type: 'string',
                        description: "The Method of Payment['cash', 'visa']"
                    }
                    ,
                    day: {
                        type: 'string',
                        description: 'The Day of the Appointment'
                    }
                },
                example: {              
                    "clinic": 3,
                    "doctor": 1,
                    "patient": 2,
                    "payment": "cash",
                    "day": "sunday"
              
                }
            
            },
            Invoice: {
                type: 'object',
                required: ['patientId', 'doctorId', 'description','paymentMethod','services','clinic'],
                properties: {
                    id:{
                        type: 'integer',
                        description: 'The ID of The Invoice'
                    },
                    patientId: {
                        type: 'integer',
                        description: 'The ID of The Doctor'
                    },
                    doctorId: {
                        type: 'integer',
                        description: 'The ID of The Patient'
                    },
                    
                    description: {
                        type: 'string',
                        description: "Description of the invoice"
                    }
                    ,
                    paymentMethod: {
                        type: 'string',
                        description: 'The Payment Method'
                    }
                    ,
                    services: {
                        type: 'array',
                        description: 'All the services{Name, Price}'
                    }
                    ,
                    clinic: {
                        type: 'integer',
                        description: 'The Clinic ID'
                    }
                    ,
                    total: {
                        type: 'integer',
                        description: 'The Total Price - Calculated in Run Time'
                    }
                    ,
                    createdAt: {
                        type: 'date',
                        description: 'Calculated in Run Time'
                    }
                },
                example: {              

                       
                    "patientId": 9,
                    "doctorId": 34,
                    "services": [
                    {
                        "name": "service1",
                        "price": 100
                    },
                    {
                        "name": "service2",
                        "price": 200
                    }
                ],
                    "clinic": 20
                }
            
            }
            
        },
        responses : {
            400: {
                description: 'Missing Tokken key - include it in the Authorization header',
                contents: 'application/json'
            },
            401: {
                description: 'Unauthorized - incorrect Tokken key or incorrect format',
                contents: 'application/json'
            },
            404: {
                description: 'Not found',
                contents: 'application/json'
            }
            ,
            500: {
                description: 'Internal Server Error',
                contents: 'application/json'
            }
            ,
            422: {
                description: 'Validation Error',
                contents: 'application/json'
            }
            ,
            200: {
                description: 'success',
                contents: 'application/json'
            }
        },
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization'
            }
          }
      },
      security: [{
        ApiKeyAuth: []
      }]

    },
    apis: ["./routes/reviewsRoute.js",
    "./routes/appointmentRoute.js",
    "./routes/invoiceRoute.js"],
}

module.exports = options