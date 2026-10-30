import os
import docx
from docx.shared import Inches, Pt, RGBColor

def create_sample_documents():
    uploads_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
    os.makedirs(uploads_dir, exist_ok=True)

    # 1. Create DOCX Resume
    resume_doc = docx.Document()
    title = resume_doc.add_heading("Aarav Sharma", 0)
    title.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    p_contact = resume_doc.add_paragraph("Email: student@raghire.edu | Phone: +91 98765 43210 | Bangalore, India\nGitHub: github.com/aarav-sharma-dev | LinkedIn: linkedin.com/in/aarav-sharma-dev")
    p_contact.runs[0].font.size = Pt(9.5)

    resume_doc.add_heading("Career Objective", level=1)
    resume_doc.add_paragraph("Final-year Computer Science & Engineering student seeking a Full Stack Software Engineer role. Proven experience building scalable RESTful APIs, distributed microservices, and asynchronous event architectures.")

    resume_doc.add_heading("Education", level=1)
    p_edu = resume_doc.add_paragraph()
    p_edu.add_run("Bachelor / Master of Technology (Computer Science & Allied Streams) — 2022 to 2026\n").bold = True
    p_edu.add_run("School of Computing & Technology | CGPA: 8.9 / 10.0\n")
    p_edu.add_run("Bachelor of Science in Computer Science — 2021 to 2024\n").bold = True
    p_edu.add_run("CGPA: 8.6 / 10.0")

    resume_doc.add_heading("Technical Skills", level=1)
    p_skills = resume_doc.add_paragraph()
    p_skills.add_run("• Programming Languages: ").bold = True
    p_skills.add_run("Python, Java, JavaScript, TypeScript, SQL, C++\n")
    p_skills.add_run("• Frameworks & Libraries: ").bold = True
    p_skills.add_run("FastAPI, React, Node.js, Express, Django, Tailwind CSS\n")
    p_skills.add_run("• Databases & Caching: ").bold = True
    p_skills.add_run("PostgreSQL, Redis, MySQL, MongoDB, SQLite\n")
    p_skills.add_run("• DevOps & Tools: ").bold = True
    p_skills.add_run("Docker, Git, GitHub Actions, Linux, Postman\n")
    p_skills.add_run("• Computer Science Fundamentals: ").bold = True
    p_skills.add_run("Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, System Design, Object-Oriented Programming (OOP)")

    resume_doc.add_heading("Major Projects", level=1)
    p_p1 = resume_doc.add_paragraph()
    p_p1.add_run("1. E-Commerce Microservices Engine with Caching\n").bold = True
    p_p1.add_run("Technologies: Python, FastAPI, PostgreSQL, Redis, Docker, Locust\n")
    p_p1.add_run("• Engineered a high-throughput microservices architecture capable of handling 5,000 requests per second with sub-50ms latency.\n")
    p_p1.add_run("• Implemented distributed Redis caching with cache invalidation via pub/sub notifications to maintain strict data consistency.\n")
    p_p1.add_run("• Resolved inventory decrement race conditions during flash sales by implementing the Redlock distributed locking algorithm.\n")
    p_p1.add_run("• Simulated 10,000 concurrent shoppers using Locust load testing to benchmark throughput.")

    p_p2 = resume_doc.add_paragraph()
    p_p2.add_run("2. Distributed URL Shortener Service\n").bold = True
    p_p2.add_run("Technologies: Python, PostgreSQL, Redis, Docker\n")
    p_p2.add_run("• Designed high-availability redirection engine using Base62 alphanumeric encoding.\n")
    p_p2.add_run("• Configured read-through caching in Redis, decreasing database queries by 85%.")

    resume_docx_path = os.path.join(uploads_dir, "sample_aarav_resume.docx")
    resume_doc.save(resume_docx_path)
    print(f"Created: {resume_docx_path}")

    # 2. Create Project Technical Report DOCX
    report_doc = docx.Document()
    r_title = report_doc.add_heading("Capstone Technical Architecture Report", 0)
    r_title.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    report_doc.add_paragraph("Project Title: E-Commerce Microservices Engine with Caching\nCandidate: Aarav Sharma | Candidate ID: CAND-2026-042 | Batch: 2026\nSupervisor: Department of Computing & Applied Engineering")

    report_doc.add_heading("Section 1: Problem Statement & Objectives", level=1)
    report_doc.add_paragraph("Traditional monolithic retail platforms suffer severe latency and database deadlocks during flash-sale traffic spikes. The objective of this project is to build an event-driven, decoupled microservices catalog and ordering system capable of sustaining 5,000 requests per second with sub-50ms 95th percentile response times.")

    report_doc.add_heading("Section 2: System Architecture & Decomposition", level=1)
    report_doc.add_paragraph("The system adopts a microservices architecture coordinated by an asynchronous API Gateway. Client requests are routed to specialized services: Catalog Service, Order Processing Service, and Inventory Management Service. Inter-service communication leverages asynchronous event messaging to decouple processing.")

    report_doc.add_heading("Section 3: Caching Strategy & Redis Pub/Sub", level=1)
    report_doc.add_paragraph("The service implements Redis as a write-through cache for hot inventory items. Cache invalidation occurs via pub/sub notifications to ensure strict consistency across worker processes. Hot product catalog reads are satisfied from Redis memory in under 2ms.")

    report_doc.add_heading("Section 4: Database Design, Normalization, & ACID Guarantees", level=1)
    report_doc.add_paragraph("The transactional database is PostgreSQL, structured in Third Normal Form (3NF) to eliminate update anomalies. Composite B-Tree indexes on (tenant_id, sku) and user_id guarantee O(log N) lookup performance. Transactions execute under the Read Committed isolation level with optimistic locking to prevent phantom reads during checkout.")

    report_doc.add_heading("Section 5: Concurrency, Load Testing, & Distributed Locking", level=1)
    report_doc.add_paragraph("Under simulated load of 5,000 requests per second using Locust, concurrent checkout requests are guarded by the Redlock distributed locking algorithm. This prevents race conditions and inventory overselling during simultaneous checkout attempts.")

    report_doc.add_heading("Section 6: Testing, Limitations, & Future Scope", level=1)
    report_doc.add_paragraph("The test suite includes automated Pytest unit tests, integration test fixtures, and stress benchmarks. Future enhancements include migrating to Kubernetes container orchestration and deploying geographically distributed read replicas.")

    report_docx_path = os.path.join(uploads_dir, "Ecommerce_Architecture_Report.docx")
    report_doc.save(report_docx_path)
    print(f"Created: {report_docx_path}")

    # 3. Create PDF versions if reportlab is available
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        styles = getSampleStyleSheet()
        
        # Resume PDF
        pdf_resume_path = os.path.join(uploads_dir, "sample_aarav_resume.pdf")
        doc_pdf = SimpleDocTemplate(pdf_resume_path, pagesize=letter)
        elements = [
            Paragraph("<b>Aarav Sharma</b>", styles['Title']),
            Paragraph("Email: student@raghire.edu | Phone: +91 98765 43210 | Batch 2026", styles['Normal']),
            Spacer(1, 12),
            Paragraph("<b>Career Objective:</b> Final-year engineering student seeking a Full Stack Software Engineer role.", styles['Normal']),
            Spacer(1, 10),
            Paragraph("<b>Technical Skills:</b> Python, Java, JavaScript, TypeScript, FastAPI, React, PostgreSQL, Redis, Docker, Data Structures, DBMS, Operating Systems, Computer Networks.", styles['Normal']),
            Spacer(1, 10),
            Paragraph("<b>Major Projects:</b> E-Commerce Microservices Engine with Caching (FastAPI, Redis, PostgreSQL, Docker). Engineered architecture handling 5,000 requests per second with write-through Redis caching and Redlock distributed locking.", styles['Normal']),
            Spacer(1, 10),
            Paragraph("<b>Education:</b> Bachelor of Technology (Computer Science & Allied Streams) 2022-2026, CGPA 8.9/10.", styles['Normal'])
        ]
        doc_pdf.build(elements)
        print(f"Created: {pdf_resume_path}")

        # Report PDF
        pdf_report_path = os.path.join(uploads_dir, "Ecommerce_Architecture_Report.pdf")
        doc_rep = SimpleDocTemplate(pdf_report_path, pagesize=letter)
        rep_elements = [
            Paragraph("<b>E-Commerce Microservices Architecture Report</b>", styles['Title']),
            Paragraph("Candidate: Aarav Sharma | Final Year Engineering Candidate", styles['Normal']),
            Spacer(1, 12),
            Paragraph("<b>Section 1: Problem Statement:</b> High latency during flash sales causing checkout bottlenecks.", styles['Normal']),
            Spacer(1, 8),
            Paragraph("<b>Section 2: Architecture:</b> Decoupled API gateway routing traffic to Catalog and Order services with write-through Redis caching.", styles['Normal']),
            Spacer(1, 8),
            Paragraph("<b>Section 3: Caching Strategy:</b> Redis implemented as write-through cache with pub/sub cache invalidation for strict consistency.", styles['Normal']),
            Spacer(1, 8),
            Paragraph("<b>Section 4: Database Design:</b> PostgreSQL relational schema with B-Tree indexes on product_sku and user_id, 3NF normalization.", styles['Normal']),
            Spacer(1, 8),
            Paragraph("<b>Section 5: Concurrency Handling:</b> 5,000 RPS benchmark handled via Redlock distributed locking algorithm to prevent race conditions.", styles['Normal']),
            Spacer(1, 8),
            Paragraph("<b>Section 6: Testing & Reliability:</b> Automated Pytest test suite and Locust load testing simulating 10,000 concurrent virtual shoppers.", styles['Normal'])
        ]
        doc_rep.build(rep_elements)
        print(f"Created: {pdf_report_path}")
    except Exception as e:
        print(f"Note: PDF generation skipped: {e}")

if __name__ == "__main__":
    create_sample_documents()
