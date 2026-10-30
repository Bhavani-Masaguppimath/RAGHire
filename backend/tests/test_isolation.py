import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.services.rag_service import rag_service
from app.models.project import DocumentChunk

client = TestClient(app)

def test_tenant_data_isolation():
    """
    Ensure that a RAG retrieval query initiated for User A strictly never returns
    chunks belonging to User B.
    """
    db = SessionLocal()
    user_a_id = str(uuid.uuid4())
    user_b_id = str(uuid.uuid4())

    doc_a_id = str(uuid.uuid4())
    doc_b_id = str(uuid.uuid4())

    # User A document on Machine Learning
    rag_service.store_chunks(
        db, doc_a_id, user_a_id,
        ["User A proprietary ML model training with hyperparameter tuning."],
        source_prefix="DocA"
    )

    # User B document on Distributed Databases
    rag_service.store_chunks(
        db, doc_b_id, user_b_id,
        ["User B confidential Distributed Database raft consensus protocol."],
        source_prefix="DocB"
    )

    # Query for User A searching for "database"
    results_a = rag_service.retrieve_relevant_chunks(db, "database", user_a_id, top_k=5)
    for res in results_a:
        # Check none of the retrieved chunks contain User B confidential content
        assert "confidential Distributed Database" not in res["content"]

    # Clean up test chunks
    db.query(DocumentChunk).filter(DocumentChunk.user_id.in_([user_a_id, user_b_id])).delete(synchronize_session=False)
    db.commit()
    db.close()
