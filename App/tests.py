from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Problem, Category, AppUser


class ViewsTestCase(TestCase):
    """Test cases for main views"""

    def setUp(self):
        self.client = Client()

    def test_home_page_loads(self):
        """Test that home page loads successfully"""
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)

    def test_languages_page_loads(self):
        """Test that languages page loads successfully"""
        response = self.client.get(reverse("languages"))
        self.assertEqual(response.status_code, 200)

    def test_problems_page_loads(self):
        """Test that problems page loads successfully"""
        response = self.client.get(reverse("problems"))
        self.assertEqual(response.status_code, 200)


class ModelsTestCase(TestCase):
    """Test cases for models"""

    def test_category_creation(self):
        """Test category model creation"""
        category = Category.objects.create(name="Test Category")
        self.assertEqual(str(category), "Test Category")

    def test_problem_creation(self):
        """Test problem model creation"""
        category = Category.objects.create(name="Test Category")
        problem = Problem.objects.create(
            title="Test Problem",
            description="Test description",
            difficulty="Easy",
            category=category,
        )
        self.assertEqual(str(problem), "Test Problem")
        self.assertEqual(problem.difficulty, "Easy")
