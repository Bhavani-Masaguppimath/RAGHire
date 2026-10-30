import json
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, StudentProfile, Resume, Project, ProjectDocument, DocumentChunk,
    AptitudeQuestion, AptitudeAttempt, CodingProblem, TestCase, CodingSubmission,
    InterviewSession, InterviewQuestion, InterviewResponse,
    EvidenceClaim, FollowUpQuestion, LearningRecommendation, LearningResource
)
from app.services.rag_service import rag_service

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Admin User
    admin = db.query(User).filter(User.email == "admin@raghire.edu").first()
    if not admin:
        admin = User(
            email="admin@raghire.edu",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Dr. Placement Director",
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # 2. Seed Student User
    student = db.query(User).filter(User.email == "student@raghire.edu").first()
    if not student:
        student = User(
            email="student@raghire.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Aarav Sharma",
            role="student"
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # Profile
        profile = StudentProfile(
            user_id=student.id,
            phone="+91 98765 43210",
            college="School of Computing & Information Technology",
            degree="Computer Science & Engineering (All Streams)",
            graduation_year=2026,
            target_job_role="Full Stack Software Engineer",
            bio="Software engineering candidate with hands-on experience building distributed web services and RAG-based systems.",
            experience_level="Fresher / Entry-Level",
            github_url="https://github.com/aarav-sharma-dev",
            linkedin_url="https://linkedin.com/in/aarav-sharma-dev",
            skills_json=json.dumps([
                "Python", "FastAPI", "React", "TypeScript", "PostgreSQL", 
                "Docker", "Data Structures", "DBMS", "Redis"
            ])
        )
        db.add(profile)
        db.commit()

        # Seed Sample Resume
        resume = Resume(
            user_id=student.id,
            filename="Aarav_Sharma_Resume.pdf",
            file_path="uploads/sample_aarav_resume.pdf",
            file_size=142500,
            raw_text="Aarav Sharma | Software Engineering Candidate | Target: Full Stack Software Engineer...",
            parsed_skills=json.dumps(["Python", "FastAPI", "React", "PostgreSQL", "Redis", "Docker", "Algorithms"]),
            match_score=87.5,
            matching_skills=json.dumps(["Python", "React", "PostgreSQL", "Docker", "Algorithms"]),
            missing_skills=json.dumps(["Kubernetes", "AWS"]),
            suggested_topics=json.dumps(["Container Orchestration (Kubernetes)", "Cloud Infrastructure (AWS)"]),
            is_active=True
        )
        db.add(resume)
        db.commit()

        # Seed Sample Project and Document for RAG & Project Defense
        project = Project(
            user_id=student.id,
            title="E-Commerce Microservices Engine with Caching",
            problem_statement="High latency during flash sales causing checkout bottlenecks and database locking.",
            objectives="Build an event-driven catalog and ordering microservice handling 5,000 requests/sec with sub-50ms latency.",
            technologies=json.dumps(["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"]),
            architecture_overview="Decoupled API gateway routing traffic to Catalog and Order services with write-through Redis caching.",
            database_design="PostgreSQL relational schema with read-replicas, B-Tree indexes on product_sku and user_id.",
            implementation_details="Implemented optimistic locking for inventory decrement and background celery workers.",
            testing_approach="Pytest integration tests and Locust load testing simulating 10,000 concurrent virtual shoppers.",
            challenges_and_solutions="Encountered race conditions during inventory deduction; resolved via Redis distributed lock (Redlock)."
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        # Document & Chunks for RAG retrieval
        doc = ProjectDocument(
            project_id=project.id,
            filename="Ecommerce_Architecture_Report.pdf",
            file_path="uploads/Ecommerce_Architecture_Report.pdf",
            file_type="pdf",
            chunk_count=3,
            raw_text="The system architecture relies on an asynchronous event loop in FastAPI..."
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        rag_service.store_chunks(
            db, doc.id, student.id,
            [
                "Section 3.1: Architecture and Caching Strategy. The service implements Redis as a write-through cache for hot inventory items. Cache invalidation occurs via pub/sub notifications to ensure strict consistency.",
                "Section 4.2: Database Indexing and ACID Compliance. The PostgreSQL database runs with Read Committed isolation. Foreign keys and indexes on tenant_id and sku ensure zero phantom reads during checkout.",
                "Section 5.3: Concurrency and Race Condition Handling. Under 5000 RPS, concurrent checkout requests are queued with atomic decrements, preventing overselling."
            ],
            source_prefix="Ecommerce Report"
        )

        # Seed Evidence Claims (Module 8: Cross-Round Evidence Traceability)
        c1 = EvidenceClaim(
            user_id=student.id,
            claim_text="Implemented distributed Redis caching with cache invalidation via pub/sub notifications.",
            source_type="project_doc",
            source_reference="Project Report Section 3.1",
            supporting_evidence="Verified in Project Architecture doc: Write-through cache implementation with pub/sub invalidation.",
            status="Supported by available evidence",
            confidence_score=0.92,
            reasoning="Documented architecture details match student's declared technologies."
        )
        db.add(c1)

        c2 = EvidenceClaim(
            user_id=student.id,
            claim_text="Engineered microservices architecture capable of 5,000 requests per second.",
            source_type="resume",
            source_reference="Resume Work Experience: E-Commerce Project",
            supporting_evidence="Report documents Locust testing, but hardware configuration under 5k RPS was not specified.",
            status="Needs clarification",
            confidence_score=0.74,
            reasoning="Performance claim is significant; testing conditions and machine specs need brief clarification."
        )
        db.add(c2)
        db.flush()

        # Follow-Up Question
        fq2 = FollowUpQuestion(
            claim_id=c2.id,
            user_id=student.id,
            question_text="Could you describe the infrastructure and load-testing environment (CPU cores, RAM, and test harness) used to measure the 5,000 RPS benchmark?",
            rationale="Clarifying the hardware specs validates the benchmark methodology respectfully.",
            status="pending"
        )
        db.add(fq2)

        c3 = EvidenceClaim(
            user_id=student.id,
            claim_text="Applied Redlock distributed locking algorithm to prevent concurrent inventory race conditions.",
            source_type="project_defense",
            source_reference="Project Defense Session",
            supporting_evidence="Student response confirmed Redlock implementation during defense viva.",
            status="Supported by available evidence",
            confidence_score=0.88,
            reasoning="Candidate articulated Redis lock ttl and release mechanisms convincingly."
        )
        db.add(c3)

        # Seed Learning Recommendations
        db.add(LearningRecommendation(
            user_id=student.id,
            title="Revise Time & Work Aptitude Formulas",
            category="Aptitude",
            topic="Quantitative Aptitude",
            priority="high",
            reason="Campus tests heavily emphasize combined efficiency and alternating work problems.",
            suggested_action="Solve 10 practice problems in the Aptitude Practice section.",
            resource_link="/aptitude",
            is_completed=False
        ))
        db.add(LearningRecommendation(
            user_id=student.id,
            title="Practice Sliding Window Coding Patterns",
            category="Coding",
            topic="Data Structures",
            priority="medium",
            reason="Frequently asked in initial technical coding screening rounds.",
            suggested_action="Complete Longest Substring Without Repeating Characters in the Coding Workspace.",
            resource_link="/coding",
            is_completed=False
        ))

        db.commit()

    # 3. Seed Aptitude Questions (Quantitative, Logical, Verbal, Analytical)
    if db.query(AptitudeQuestion).count() == 0:
        aptitude_pool = [
            # Quantitative
            (
                "quantitative", "Time and Work", "medium",
                "A can complete a piece of work in 12 days and B can complete it in 18 days. If they work together for 4 days, what fraction of the work remains?",
                ["1/3", "4/9", "5/9", "2/3"],
                1,
                "A's 1 day work = 1/12, B's 1 day work = 1/18. Together in 1 day = 1/12 + 1/18 = 5/36. In 4 days = 4 * 5/36 = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
            ),
            (
                "quantitative", "Percentages", "easy",
                "A student scored 450 marks out of 600 in an examination. What was their percentage?",
                ["70%", "72.5%", "75%", "77.5%"],
                2,
                "Percentage = (450 / 600) * 100 = 0.75 * 100 = 75%."
            ),
            (
                "quantitative", "Speed Distance Time", "hard",
                "A train 180 meters long running at 72 km/h crosses a platform in 25 seconds. What is the length of the platform?",
                ["300 m", "320 m", "350 m", "400 m"],
                1,
                "Speed in m/s = 72 * (5/18) = 20 m/s. Distance in 25 sec = 20 * 25 = 500 m. Platform length = 500 - 180 = 320 meters."
            ),
            # Logical
            (
                "logical", "Syllogisms", "medium",
                "Statements: All engineers are problem solvers. Some problem solvers are designers. Conclusions: I. Some engineers are designers. II. All designers are problem solvers.",
                ["Only conclusion I follows", "Only conclusion II follows", "Neither conclusion follows", "Both follow"],
                2,
                "No direct link establishes that engineers are designers, and 'some problem solvers are designers' does not mean all designers are problem solvers. Thus neither follows."
            ),
            (
                "logical", "Number Series", "easy",
                "What is the next number in the sequence: 4, 9, 19, 39, 79, ...?",
                ["119", "139", "159", "169"],
                2,
                "Pattern is (x * 2) + 1: 4*2+1=9, 9*2+1=19, 19*2+1=39, 39*2+1=79, 79*2+1=159."
            ),
            # Verbal
            (
                "verbal", "Sentence Correction", "medium",
                "Choose the grammatically correct sentence:",
                [
                    "Neither the manager nor the developers was present at the deployment review.",
                    "Neither the manager nor the developers were present at the deployment review.",
                    "Neither the manager or the developers was present at the deployment review.",
                    "Neither the manager and the developers were present at the deployment review."
                ],
                1,
                "When subject parts are connected by 'neither... nor', the verb agrees with the closer subject ('developers' is plural, so 'were' is correct)."
            ),
            # Analytical
            (
                "analytical", "Data Sufficiency", "medium",
                "Is x greater than y? Statement I: x + y = 20. Statement II: x - y = 6.",
                [
                    "Statement I alone is sufficient",
                    "Statement II alone is sufficient",
                    "Both statements together are needed",
                    "Each statement alone is sufficient"
                ],
                1,
                "Statement II: x - y = 6 directly implies x = y + 6, which proves x > y without needing Statement I."
            )
        ]

        for cat, top, diff, q_text, opts, ans_idx, expl in aptitude_pool:
            db.add(AptitudeQuestion(
                category=cat,
                topic=top,
                difficulty=diff,
                question_text=q_text,
                options=json.dumps(opts),
                correct_option_index=ans_idx,
                explanation=expl
            ))
        db.commit()

    # 4. Seed Coding Problems with Test Cases
    if db.query(CodingProblem).count() == 0:
        # Problem 1: Two Sum
        p1 = CodingProblem(
            title="Two Sum",
            slug="two-sum",
            difficulty="easy",
            topic="Arrays & Hash Maps",
            description="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            constraints="2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
            input_format="First line: space-separated integers for nums array.\nSecond line: integer target.",
            output_format="Space-separated indices of the two numbers in ascending order.",
            sample_input="2 7 11 15\n9",
            sample_output="0 1",
            sample_explanation="nums[0] + nums[1] == 2 + 7 == 9, so we return 0 1.",
            python_starter_code="""def two_sum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return f"{seen[complement]} {i}"
        seen[num] = i
    return ""

import sys
lines = sys.stdin.read().strip().split('\\n')
if len(lines) >= 2:
    nums = list(map(int, lines[0].split()))
    target = int(lines[1])
    print(two_sum(nums, target))
""",
            java_starter_code="""import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int target = sc.nextInt();
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < parts.length; i++) {
            int num = Integer.parseInt(parts[i]);
            int complement = target - num;
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(num, i);
        }
    }
}
"""
        )
        db.add(p1)
        db.commit()
        db.refresh(p1)

        db.add(TestCase(problem_id=p1.id, input_data="2 7 11 15\n9", expected_output="0 1", is_hidden="false"))
        db.add(TestCase(problem_id=p1.id, input_data="3 2 4\n6", expected_output="1 2", is_hidden="true"))
        db.add(TestCase(problem_id=p1.id, input_data="3 3\n6", expected_output="0 1", is_hidden="true"))

        # Problem 2: Longest Substring Without Repeating Characters
        p2 = CodingProblem(
            title="Longest Substring Without Repeating Characters",
            slug="longest-substring-without-repeating-characters",
            difficulty="medium",
            topic="Sliding Window",
            description="Given a string s, find the length of the longest substring without repeating characters.",
            constraints="0 <= s.length <= 5 * 10^4",
            input_format="Single line string s.",
            output_format="Integer representing maximum length.",
            sample_input="abcabcbb",
            sample_output="3",
            sample_explanation="The answer is 'abc', with the length of 3.",
            python_starter_code="""def length_of_longest_substring(s):
    char_map = {}
    left = 0
    max_len = 0
    for right in range(len(s)):
        if s[right] in char_map and char_map[s[right]] >= left:
            left = char_map[s[right]] + 1
        char_map[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len

import sys
s = sys.stdin.read().strip()
print(length_of_longest_substring(s))
""",
            java_starter_code="""import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        System.out.println(maxLen);
    }
}
"""
        )
        db.add(p2)
        db.commit()
        db.refresh(p2)

        db.add(TestCase(problem_id=p2.id, input_data="abcabcbb", expected_output="3", is_hidden="false"))
        db.add(TestCase(problem_id=p2.id, input_data="bbbbb", expected_output="1", is_hidden="true"))
        db.add(TestCase(problem_id=p2.id, input_data="pwwkew", expected_output="3", is_hidden="true"))

        db.commit()

    db.close()
    print("Database seeded successfully with Placement Ready candidate sample data.")

if __name__ == "__main__":
    seed_database()
