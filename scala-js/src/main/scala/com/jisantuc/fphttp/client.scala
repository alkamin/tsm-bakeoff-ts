package com.jisantuc.fphttp

import com.azavea.stac4s.StacCollection
import com.azavea.stac4s.api.client.SttpStacClient

import java.net.URI
import java.nio.charset.StandardCharsets
import java.util.UUID

import scala.concurrent.Future
import scala.scalajs.js.annotation.JSExportTopLevel

import eu.timepit.refined.types.string.NonEmptyString
import io.circe.CursorOp
import io.circe.DecodingFailure
import io.circe.ParsingFailure
import sttp.client3._
import sttp.client3.circe._
import sttp.model.Uri

object client {
  implicit val ec = scala.concurrent.ExecutionContext.Implicits.global
  val backend = FetchBackend()
  private val client = SttpStacClient(backend, uri"http://localhost:9090")

  @JSExportTopLevel("collection")
  def collection(collectionId: String): Future[StacCollection] =
    client.collection(NonEmptyString.unsafeFrom(collectionId))

  @JSExportTopLevel("collections")
  def collections(): Future[List[StacCollection]] = client.collections

}
