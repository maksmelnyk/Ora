# from loguru import logger
# from typing import Any, Dict, List
# from aio_pika.abc import AbstractIncomingMessage

# from app.core.messaging.consumers.consumer import Consumer
# from app.core.messaging.constants import RabbitMqConstants


# class MessageConsumer(Consumer):
#     """Consumer for processing learning-related events triggered by payments."""
#     def __init__(self):

#     @property
#     def queue_name(self) -> str:
#         return RabbitMqConstants.PAYMENT_QUEUE_NAME

#     @property
#     def routing_patterns(self) -> List[str]:
#         return []

#     async def handle_message(
#         self,
#         message_body: str,
#         headers: Dict[str, Any],
#         message: AbstractIncomingMessage,
#     ) -> bool:
#         """
#         Handles an incoming message from the payment queue.
#         Delegates processing to the LearningEventProcessingService.
#         """
#         message_id = message.message_id or "unknown"
#         event_type = headers.get("__TypeId__")

#         logger.info(
#             f"MessageConsumer received message: id={message_id}, type={event_type}"
#         )

#         try:
#             # try:
#             #     event_data = json.loads(message_body)
#             # except json.JSONDecodeError:
#             #     logger.error(
#             #         f"Failed to decode JSON message body for message ID {message_id}. Message body: {message_body[:200]}...",
#             #         exc_info=True,
#             #     )
#             #     return True

#             # Delegate the actual business logic to the service
#             # Pass the parsed event data dictionary to the service method

#             return True

#         except Exception as e:
#             logger.error(
#                 f"Unexpected error processing message ID {message_id} in PaymentEventsConsumer: {e}",
#                 exc_info=True,
#             )
#             return False
