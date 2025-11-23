export const handler = awslambda.streamifyResponse(
   async (event, responseStream, context) => {

      const httpResponseMetadata = {
         statusCode: 200,
         headers: {
            'Content-Type': 'text/plain',
            'X-Custom-Header': 'some-value'
         }
      };

      responseStream = awslambda.HttpResponseStream.from(
         responseStream,
         httpResponseMetadata
      );

      responseStream.write('hello');
      await new Promise(r => setTimeout(r, 1000));
      responseStream.write(' world');
      await new Promise(r => setTimeout(r, 1000));
      responseStream.write('!!!');
      responseStream.end();
   }
);