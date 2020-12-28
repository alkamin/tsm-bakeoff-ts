package com.jisantuc.fphttp

import com.azavea.stac4s.StacCollection
import sttp.client._
import sttp.client.circe._
import sttp.model.Uri

import scala.concurrent.Future
import io.circe.DecodingFailure
import io.circe.CursorOp
import io.circe.ParsingFailure

import java.net.URI
import java.util.UUID
import scala.scalajs.js.annotation.JSExportTopLevel
import java.nio.charset.StandardCharsets

object client {
  val client = basicRequest
  implicit val ec = scala.concurrent.ExecutionContext.Implicits.global
  implicit val backend = FetchBackend()

  @JSExportTopLevel("collection")
  def collection(collectionId: String): Future[StacCollection] =
    client
      .get(uri"http://localhost:9090/collections/$collectionId")
      .response(asJson[StacCollection])
      .send()
      .decode

  @JSExportTopLevel("collections")
  def collections(): Future[List[StacCollection]] =
    client
      .get(Uri(URI.create("http://localhost:9090/collections")))
      .response(asJson[List[StacCollection]])
      .send()
      .decode

  implicit class SttpResponse[T](
      r: Future[Response[Either[ResponseError[io.circe.Error], T]]]
  ) {

    def decode: Future[T] = {
      r.flatMap { response =>
        response.body match {
          case Left(err) =>
            err match {
              case DeserializationError(s, DecodingFailure(_, history)) =>
                val fieldErrors = CursorOp.opsToPath(history)
                Future.failed(
                  new Exception(
                    s"Could not decode response -- problems at $fieldErrors.\nUnderlying: $s"
                  )
                )
              case DeserializationError(_, ParsingFailure(_, _)) =>
                Future.failed(
                  new Exception(
                    s"Did not receive json from API server. Status was: ${response.code}. Body was: ${response.body}."
                  )
                )
              case err: HttpError =>
                Future.failed(
                  new Exception(
                    s"Encountered error while making request: ${err.body}"
                  )
                )
              case _ =>
                Future.failed(err)
            }
          case Right(value) => Future.successful(value)
        }
      }
    }
  }
}
